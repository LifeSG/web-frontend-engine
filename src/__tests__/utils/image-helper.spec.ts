import { ImageHelper } from "../../utils";

const createBlobOfSize = (size: number) => new Blob([new Uint8Array(size)], { type: "image/jpeg" });

describe("ImageHelper", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("canvasToBlob", () => {
		it("should encode canvas via toDataURL instead of toBlob", async () => {
			const canvas = document.createElement("canvas");
			const toBlobSpy = jest.spyOn(canvas, "toBlob");
			const toDataURLSpy = jest.spyOn(canvas, "toDataURL").mockReturnValue("data:image/jpeg;base64,AAEC");

			const blob = await ImageHelper.canvasToBlob(canvas, "image/jpeg", 0.5);

			expect(toDataURLSpy).toHaveBeenCalledWith("image/jpeg", 0.5);
			expect(toBlobSpy).not.toHaveBeenCalled();
			expect(blob.type).toBe("image/jpeg");
			expect(blob.size).toBe(3);
		});

		it("should use the mime type returned by the browser", async () => {
			const canvas = document.createElement("canvas");
			jest.spyOn(canvas, "toDataURL").mockReturnValue("data:image/png;base64,AA==");

			expect((await ImageHelper.canvasToBlob(canvas, "image/webp")).type).toBe("image/png");
		});

		it("should reject if the canvas cannot be encoded", async () => {
			const canvas = document.createElement("canvas");
			jest.spyOn(canvas, "toDataURL").mockReturnValue("data:,");

			await expect(ImageHelper.canvasToBlob(canvas)).rejects.toThrow("failed to encode canvas");
		});
	});

	describe("compressImage", () => {
		const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
		let toDataURLSpy: jest.Mock;

		/** mocks canvas encoding to return a jpeg of the given byte size for each call */
		const mockEncodedSizes = (...sizes: number[]) => {
			sizes.forEach((size) =>
				toDataURLSpy.mockReturnValueOnce(`data:image/jpeg;base64,${btoa("a".repeat(size))}`)
			);
		};

		beforeEach(() => {
			URL.createObjectURL = jest.fn(() => "blob:mock");
			URL.revokeObjectURL = jest.fn();
			// trigger onload as soon as src is set since jsdom does not load images
			jest.spyOn(HTMLImageElement.prototype, "src", "set").mockImplementation(function (this: HTMLImageElement) {
				setTimeout(() => this.onload?.(new Event("load")));
			});
			// jest-canvas-mock shares one mock across tests, replace it so calls and queued values do not leak
			toDataURLSpy = jest.fn(originalToDataURL);
			HTMLCanvasElement.prototype.toDataURL = toDataURLSpy;
		});

		afterEach(() => {
			HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
		});

		it("should return the file as is if it is within the file size", async () => {
			const file = createBlobOfSize(1024);

			expect(await ImageHelper.compressImage(file, { fileSize: 1 })).toBe(file);
			expect(toDataURLSpy).not.toHaveBeenCalled();
		});

		it("should reduce quality until the file size is met without using canvas.toBlob", async () => {
			const toBlobSpy = jest.spyOn(HTMLCanvasElement.prototype, "toBlob");
			mockEncodedSizes(3000, 2000, 1000);

			const result = await ImageHelper.compressImage(createBlobOfSize(4000), { fileSize: 1, quality: 0.9 });

			expect(result.size).toBe(1000);
			expect(toBlobSpy).not.toHaveBeenCalled();
			expect(toDataURLSpy.mock.calls.map(([, quality]) => quality)).toEqual([
				0.9,
				expect.closeTo(0.8),
				expect.closeTo(0.7),
			]);
		});

		it("should decode the image only once across attempts", async () => {
			mockEncodedSizes(3000, 1000);

			await ImageHelper.compressImage(createBlobOfSize(4000), { fileSize: 1 });

			expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
		});

		it("should return the last compressed image when maxAttempts is reached", async () => {
			mockEncodedSizes(3000, 2500, 2000);

			const result = await ImageHelper.compressImage(createBlobOfSize(4000), { fileSize: 1, maxAttempts: 2 });

			expect(toDataURLSpy).toHaveBeenCalledTimes(3);
			expect(result.size).toBe(2000);
		});

		it("should return the original file if lowest quality still exceeds file size", async () => {
			const file = createBlobOfSize(4000);
			toDataURLSpy.mockReturnValue(`data:image/jpeg;base64,${btoa("a".repeat(3000))}`);

			expect(await ImageHelper.compressImage(file, { fileSize: 1 })).toBe(file);
			expect(toDataURLSpy).toHaveBeenCalledTimes(11);
		});
	});

	describe("compressToTargetSize", () => {
		it("should binary search quality without using canvas.toBlob", async () => {
			const canvas = document.createElement("canvas");
			const toBlobSpy = jest.spyOn(canvas, "toBlob");
			const toDataURLSpy = jest
				.spyOn(canvas, "toDataURL")
				.mockImplementation(
					(_type, quality: number) => `data:image/jpeg;base64,${btoa("a".repeat(Math.round(quality * 2000)))}`
				);

			const result = await ImageHelper.compressToTargetSize(canvas, { fileSize: 1 });

			expect(toBlobSpy).not.toHaveBeenCalled();
			expect(toDataURLSpy.mock.calls[0][1]).toBe(0.5);
			expect(result.size).toBeLessThanOrEqual(1024);
		});
	});
});
