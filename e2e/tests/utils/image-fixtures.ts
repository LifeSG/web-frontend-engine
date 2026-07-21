import { deflateSync } from "node:zlib";

// =============================================================================
// INTERNALS
// =============================================================================
const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[i] = c;
	}
	return table;
})();

function crc32(buf: Buffer): number {
	let crc = 0xffffffff;
	for (const byte of buf) {
		crc = (CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)) >>> 0;
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type: string, data: Buffer): Buffer {
	const typeBuffer = Buffer.from(type, "ascii");
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length);
	const crcValue = crc32(Buffer.concat([typeBuffer, data]));
	const crcBuffer = Buffer.alloc(4);
	crcBuffer.writeUInt32BE(crcValue);
	return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Creates a solid color PNG image buffer.
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @param r Red channel (0–255)
 * @param g Green channel (0–255)
 * @param b Blue channel (0–255)
 */
export function createSolidColorPng(width: number, height: number, r: number, g: number, b: number): Buffer {
	const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

	// IHDR: width, height, 8-bit depth, RGB color type (2), no compression/filter/interlace
	const ihdrData = Buffer.alloc(13);
	ihdrData.writeUInt32BE(width, 0);
	ihdrData.writeUInt32BE(height, 4);
	ihdrData.writeUInt8(8, 8);
	ihdrData.writeUInt8(2, 9);
	ihdrData.writeUInt8(0, 10);
	ihdrData.writeUInt8(0, 11);
	ihdrData.writeUInt8(0, 12);
	const ihdr = createChunk("IHDR", ihdrData);

	// Raw image data: one filter byte (None=0) per row, then RGB pixel data
	const rowSize = 1 + width * 3;
	const rawData = Buffer.alloc(height * rowSize);
	for (let y = 0; y < height; y++) {
		const offset = y * rowSize;
		rawData[offset] = 0; // filter type: None
		for (let x = 0; x < width; x++) {
			rawData[offset + 1 + x * 3] = r;
			rawData[offset + 2 + x * 3] = g;
			rawData[offset + 3 + x * 3] = b;
		}
	}
	const idat = createChunk("IDAT", deflateSync(rawData));
	const iend = createChunk("IEND", Buffer.alloc(0));

	return Buffer.concat([signature, ihdr, idat, iend]);
}
