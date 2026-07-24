# Image Compression Performance Fix

## Problem

On Android devices, the image compression flow was significantly slower than iOS. Profiling showed that `convertBlob` consumed ~73% of total compression time (1028ms / 1402ms on a typical 8MB JPEG).

### Root Cause

The original compression flow performed a redundant full-resolution encode/decode cycle:

```
File (8MB)
  → blobToImage (decode #1)
  → canvas.drawImage at full resolution (2634x4680 = 12.3M pixels)
  → canvas.toDataURL("image/jpeg")        ← BOTTLENECK: full-res JPEG encode
  → dataUrlToImage (decode #2)             ← redundant second decode
  → resampleImage (scale down to 1024x1024)
  → compressImage (quality loop)
```

`canvas.toDataURL()` on a full-resolution canvas is extremely expensive, especially on Android where Chrome's software JPEG encoder is slower than iOS Safari's hardware-accelerated path. This step produced a 3.3MB base64 dataURL only to immediately decode it back into an `HTMLImageElement` for the next step.

## Solution

Eliminated the redundant encode/decode cycle by:

1. Adding `ImageHelper.ensureDecodableBlob()` - handles only the HEIC/HEIF conversion (required for iOS photos) without touching other formats.
2. Using `ImageHelper.blobToImage()` directly - decodes the original file binary via `URL.createObjectURL`, skipping the canvas round-trip entirely.
3. Passing `type` to `resampleImage()` - ensures the output MIME type is correct without needing `convertBlob`.

### New Flow

```
File (8MB)
  → ensureDecodableBlob (HEIC → JPEG if needed, otherwise passthrough)
  → blobToImage (decode once via object URL)
  → resampleImage (scale + correct output type)
  → compressImage (quality loop)
```

## Results

Tested with an 8241 KB JPEG (2634x4680):

| Step                    | Before   | After   | Delta   |
|-------------------------|----------|---------|---------|
| convertBlob/ensureBlob  | 1028 ms  | 137 ms  | -891 ms |
| decode                  | 27 ms    | 92 ms   | +65 ms  |
| resample                | 116 ms   | 242 ms  | +126 ms |
| quality compression     | 173 ms   | 115 ms  | -58 ms  |
| metadata + final dataURL| 57 ms    | 130 ms  | +73 ms  |
| **Total**               |**1402 ms**|**717 ms**| **-49%** |

`decode` and `resample` increased slightly because they now process the original binary (8MB) instead of a re-encoded dataURL. However, eliminating the full-res canvas encode more than compensates.

On Android (where `canvas.toDataURL` is 2-3x slower than iOS), the improvement is even more pronounced.

## Files Changed

- `src/utils/image-helper.ts` - Added `ensureDecodableBlob()` export
- `src/components/fields/image-upload/image-manager/image-manager.ts` - Replaced `convertBlob` + `dataUrlToImage` with `ensureDecodableBlob` + `blobToImage` in the `compressImage` flow

## Impact

- No breaking changes to the public API
- `convertBlob` is still used by the `convertImage` flow (when `compress=false`)
- HEIC support (iOS) is preserved via `ensureDecodableBlob`
- All platforms (iOS, Android, Desktop) benefit from this fix
