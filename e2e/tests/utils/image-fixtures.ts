import { deflateSync } from "zlib";

// =============================================================================
// PNG GENERATION HELPERS
// Used to produce a visible solid-colour PNG instead of a 1×1 pixel stand-in
// so that drawn strokes are clearly distinguishable from the backdrop.
// =============================================================================
const CRC32_TABLE = (() => {
	const t: number[] = [];
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[i] = c;
	}
	return t;
})();

function crc32(buf: Buffer): number {
	let crc = 0xffffffff;
	for (let i = 0; i < buf.length; i++) crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
	const typeBytes = Buffer.from(type, "ascii");
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
	return Buffer.concat([len, typeBytes, data, crc]);
}

/** Returns a valid PNG buffer filled with a single solid RGB colour. */
export function createSolidColorPng(width: number, height: number, r: number, g: number, b: number): Buffer {
	// Build one row: [filter=None, R, G, B, R, G, B, ...]
	const row = Buffer.alloc(1 + width * 3);
	for (let x = 0; x < width; x++) {
		row[1 + x * 3] = r;
		row[2 + x * 3] = g;
		row[3 + x * 3] = b;
	}
	// Repeat for all rows, then zlib-compress for IDAT
	const raw = Buffer.concat(Array.from({ length: height }, () => row));

	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr.writeUInt8(8, 8); // bit depth
	ihdr.writeUInt8(2, 9); // color type: RGB

	return Buffer.concat([
		Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
		pngChunk("IHDR", ihdr),
		pngChunk("IDAT", deflateSync(raw)),
		pngChunk("IEND", Buffer.alloc(0)),
	]);
}
