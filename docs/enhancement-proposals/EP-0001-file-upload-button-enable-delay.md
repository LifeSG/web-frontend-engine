# EP-0001: Fix File Upload Continue Button Enable Delay

**Created**: 2026-05-22

-   [Summary](#summary)
-   [Motivation](#motivation)
    -   [Goals](#goals)
    -   [Non-Goals](#non-goals)
-   [Root Cause Analysis](#root-cause-analysis)
    -   [Observed Behaviour](#observed-behaviour)
    -   [Component Tree](#component-tree)
    -   [The Race Condition](#the-race-condition)
    -   [Exact Offending Code](#exact-offending-code)
-   [Proposal](#proposal)
    -   [Acceptance Criteria](#acceptance-criteria)
        -   [AC 1](#ac-1)
        -   [AC 2](#ac-2)
        -   [AC 3](#ac-3)
    -   [Notes/Constraints/Caveats](#notesconstraintscaveats)
    -   [Risks and Mitigation](#risks-and-mitigation)
-   [Design Details](#design-details)
    -   [Frontend](#frontend)
-   [Alternatives](#alternatives)
-   [Infrastructure Needed](#infrastructure-needed)
-   [Review \& Acceptance Checklist](#review--acceptance-checklist)
-   [Execution Status](#execution-status)

## Summary

The `file-upload` field causes a noticeable delay between when a file
finishes uploading and when the form's continue/submit button becomes
enabled. The delay is caused by a React effect execution order race
condition inside `FileUploadInner` and `FileUploadManager`, where a
stale `filesRef.current` value causes the first Yup validation after
upload completion to incorrectly report the form as invalid. A second
render cycle is then required to correct this, producing the visible
delay.

## Motivation

Consumers of `web-frontend-engine` (e.g. `ccube-web-sequential`) gate
their continue button on the form's validity via the `onChange` callback.
After a file upload completes, the `onChange` callback receives
`isValid: false` on the first invocation and only `isValid: true` on a
subsequent invocation triggered by a schema rebuild cycle. Users see the
progress indicator reach 100 % and then wait an additional render cycle
before the button enables, creating an inconsistent and confusing
experience.

### Goals

-   The continue/submit button must enable in the same render cycle that
    a file upload completes, with no additional delay.
-   The `onChange` callback must not emit a spurious `isValid: false`
    event after an upload completes when all other fields are valid.
-   The fix must not affect upload error handling or multi-file upload
    scenarios.

### Non-Goals

-   Changing the overall form-validation architecture (Yup resolver,
    `hardValidationSchema`, `useFormChange`).
-   Fixing upload progress display for cases unrelated to the button
    enable delay.
-   Modifying consumers of `web-frontend-engine` (e.g.
    `ccube-web-sequential`).

## Root Cause Analysis

### Observed Behaviour

1. User attaches a file. The progress indicator advances to 99 % (capped
   deliberately by `onUploadProgress`).
2. The server responds. The upload is complete.
3. The progress indicator stays below 100 % for a noticeable moment.
4. The continue button and the progress indicator become active
   simultaneously — one render cycle later than the upload completion.

### Component Tree

```
FileUploadProvider          ← owns `files` state (useState)
  └─ FileUploadInner        ← owns filesRef, calls setFieldValidationConfig
       └─ FileUploadManager ← calls setValue (react-hook-form)
```

Both `FileUploadInner` and `FileUploadManager` consume `files` from
`FileUploadContext`. When `setFiles` is called inside `FileUploadManager`
(via `setFilesIfMounted`), both components receive the updated `files`
value in the same React render pass.

### The Race Condition

React executes `useEffect` hooks **depth-first**: child effects run
before parent effects within the same commit.

```
files state: UPLOADING → UPLOADED  (single setState call)
│
└─ React render (both components see new files)
│
└─ Effects run (child-first order):
│
│  1. FileUploadManager effect (CHILD):
│       setValue(id, uploadedFiles) ← RHF value change
│         └─ watch subscription fires
│              └─ checkIsFormValid(true)  ← async Yup
│                   └─ no-interim-statuses test reads filesRef.current
│                        ← filesRef.current = UPLOADING  ← STALE!
│                        └─ test returns false
│                   └─ form is INVALID
│              └─ onChange(values, false) fires
│         → isFormValid = false → button stays DISABLED ❌
│
│  2. FileUploadInner effect (PARENT):  ← runs TOO LATE
│       filesRef.current = files  ← updated here (UPLOADING → UPLOADED)
│       setFieldValidationConfig(...)
│         └─ formValidationConfig changes (React state update)
│              └─ triggers another render cycle
│                   └─ onChange useEffect re-fires
│                        └─ checkIsFormValid(true)
│                             ← filesRef.current = UPLOADED ✓
│                             └─ form is VALID
│                        └─ onChange(values, true) fires
│              → isFormValid = true → button ENABLED ✅
```

The button enables **one extra render cycle** after upload completion
because `filesRef.current` is updated in a `useEffect` (parent, runs
second) while `setValue` — which triggers validation — is called in a
child effect that runs first.

### Exact Offending Code

**File**: `src/components/fields/file-upload/file-upload.tsx`

```typescript
// Line ~84 — filesRef is updated asynchronously via useEffect.
// This runs AFTER FileUploadManager's setValue effect, so any
// validation triggered by setValue reads a stale filesRef.current.
useEffect(() => {
	filesRef.current = files;
}, [files]);
```

The `no-interim-statuses` Yup test (also in `file-upload.tsx`) closes
over `filesRef`:

```typescript
.test("no-interim-statuses", ERROR_MESSAGES.UPLOAD().UPLOADING, () => {
    return !filesRef.current.some(
        (file) => processingStatuses.has(file.status)
    );
})
```

Because `filesRef.current` is stale when this test first runs after
upload completion, it incorrectly returns `false`, marking the form
invalid.

## Proposal

Fix the stale `filesRef` by updating it **synchronously during render**
rather than inside a `useEffect`. Since `FileUploadInner` (parent)
renders before `FileUploadManager` (child), the ref will always be
current by the time any child effect executes.

### Acceptance Criteria

#### AC 1

**GIVEN**: A form with a required `file-upload` field and all other
fields valid\
**WHEN**: The user attaches a file and the upload completes\
**THEN**: The continue/submit button becomes enabled in the same render
cycle — with no additional delay after the progress indicator reaches
100 %

#### AC 2

**GIVEN**: A form with a required `file-upload` field\
**WHEN**: The user attaches a file and the upload fails\
**THEN**: The continue/submit button remains disabled and the upload
error message is displayed correctly

#### AC 3

**GIVEN**: A form where the user uploads multiple files simultaneously\
**WHEN**: Files complete uploading at different times\
**THEN**: The button enables only after the last file has finished and
all other form fields are valid, without spurious intermediate enable
states

### Notes/Constraints/Caveats

-   Updating a ref synchronously during render is an established React
    pattern. It does not violate the rules of hooks and does not cause
    re-renders.
-   The `filesRef` is only read inside Yup test callbacks and the
    `hasHeldProgress` effect — both of which run after render, so the
    synchronous update is always visible to them.
-   The `useEffect(() => { filesRef.current = files }, [files])` pattern
    was likely introduced to avoid a stale-closure warning from ESLint,
    but refs are explicitly excluded from exhaustive-deps rules; the
    synchronous pattern is safe here.

### Risks and Mitigation

| Risk                                                                                                     | Impact | Mitigation                                                                                                                               |
| -------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Synchronous ref update causes unexpected side effects in other field event handlers that read `filesRef` | Low    | `filesRef` is only used in the Yup `no-interim-statuses` test and the `hasHeldProgress` effect; both paths are covered by existing tests |
| Fix does not cover `image-upload` field if it shares the same pattern                                    | Low    | `image-upload` uses a separate implementation; a separate audit should confirm whether it is affected                                    |
| Existing tests masked the bug                                                                            | Medium | Add a regression test that asserts `onChange` emits `isValid: true` in the same tick as the final `setValue` after upload                |

## Design Details

### Frontend

#### Change in `file-upload.tsx`

Replace the `useEffect`-based ref sync with a synchronous render-time
assignment. This ensures `filesRef.current` is always up-to-date before
any child effect runs.

**Before** (`src/components/fields/file-upload/file-upload.tsx`):

```typescript
const filesRef = useRef<IFile[]>(files);

useEffect(() => {
	filesRef.current = files;
}, [files]);
```

**After**:

```typescript
const filesRef = useRef<IFile[]>(files);
filesRef.current = files; // sync — always current before child effects
```

This is the only code change required. No other files need to be
modified.

#### Why This Works

React renders parent components before child components. When
`FileUploadProvider` updates `files` state:

1. `FileUploadInner` (parent) renders — `filesRef.current = files`
   executes synchronously, setting the ref to the new `UPLOADED` state.
2. `FileUploadManager` (child) renders.
3. Effects run depth-first — `FileUploadManager`'s `setValue` effect
   fires first, but `filesRef.current` is already `UPLOADED`.
4. The `watch` subscription fires → `checkIsFormValid(true)` →
   `no-interim-statuses` reads the correct `UPLOADED` state → returns
   `true` → `onChange(values, true)` → button enables in this cycle. ✅

The second render cycle (schema rebuild via `setFieldValidationConfig`)
still occurs but is now redundant for the button-enable path; it no
longer causes a visible delay.

## Alternatives

### Option B — Trigger `setValue` from `FileUploadInner` after `filesRef` is updated

Refactor so that `FileUploadManager` signals completion to
`FileUploadInner` (via context or a callback), and `FileUploadInner`
calls `setValue` after updating `filesRef.current`. This preserves the
`useEffect` ref update pattern.

**Rejected**: Significant refactor with higher risk. The synchronous ref
update (Option A / the proposal) achieves the same result with a
one-line change and no structural changes.

### Option C — Move `filesRef` into `FileUploadContext`

Store the ref inside `FileUploadProvider` so both `FileUploadInner` and
`FileUploadManager` can read/write it without ordering constraints.

**Rejected**: Putting a mutable ref inside a React context is
unconventional and provides no benefit over the synchronous render-time
update. It also widens the surface area of the context.

### Option D — Use sync Yup validation in `checkIsFormValid` within the `watch` subscription

Change the `onChange` watch subscription in `use-form-change.ts` from
`await checkIsFormValid(true)` (async) to `checkIsFormValid()` (sync)
to remove the Promise chain from the critical path.

**Rejected**: Does not fix the stale `filesRef` root cause — the
`no-interim-statuses` test would still return `false` on the first
invocation. Also introduces risk for forms with genuinely async Yup
validators.

### Option E — Dispatch an `upload-complete` field event from `FileUploadManager`

After a successful upload, `FileUploadManager` dispatches a custom field
event (e.g. `"upload-complete"`). Consumers register a listener and
immediately check form validity, bypassing the Yup cycle.

**Rejected**: Requires coordinated changes in both `web-frontend-engine`
and every consumer (e.g. `ccube-web-sequential`). The root cause is a
library-internal ordering issue; it should be fixed inside the library
without requiring consumer changes.

## Infrastructure Needed

No additional infrastructure required.

---

## Review & Acceptance Checklist

-   [ ] Root cause confirmed by reviewer via local reproduction
-   [x] Unit test added to assert `onChange` emits `isValid: true` in
        the same tick as `setValue` after upload completion
-   [ ] AC 1, AC 2, AC 3 manually verified
-   [x] `image-upload` field audited for the same `useEffect` ref
        pattern

## Execution Status

-   [x] Root cause identified and documented
-   [x] Code change implemented
-   [x] Unit / integration tests added
-   [ ] PR raised against `web-frontend-engine`
