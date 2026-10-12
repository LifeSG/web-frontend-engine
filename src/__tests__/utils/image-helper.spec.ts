import { heicTo } from "heic-to/csp";
import { FileHelper } from "../../utils/file-helper";
import { ImageHelper } from "../../utils/image-helper";

jest.mock("heic-to/csp", () => ({ heicTo: jest.fn() }));

describe("ImageHelper", () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe("convertHeicToBlob", () => {
		it.each(["image/heic", "image/heif"])("should convert %s to the requested type", async (mime) => {
			const input = new Blob(["heic"], { type: mime });
			const output = new Blob(["png"], { type: "image/png" });
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "heic", mime });
			jest.mocked(heicTo).mockResolvedValue(output);

			expect(await ImageHelper.convertHeicToBlob(input, "image/png")).toBe(output);
			expect(heicTo).toHaveBeenCalledWith({ blob: input, type: "image/png" });
		});

		it("should leave browser-decodable images unchanged", async () => {
			const input = new Blob(["jpeg"], { type: "image/jpeg" });
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });

			expect(await ImageHelper.convertHeicToBlob(input)).toBe(input);
			expect(heicTo).not.toHaveBeenCalled();
		});
	});

	describe("drawImageToCanvas", () => {
		it("should scale the image and return the same canvas used for encoding", async () => {
			const image = new Image(1000, 800);
			const blob = new Blob(["jpeg"], { type: "image/jpeg" });
			const encodeSpy = jest.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
				callback(blob);
			});

			const result = await ImageHelper.drawImageToCanvas(image, { scale: 0.5 });

			expect(result.canvas.width).toBe(500);
			expect(result.canvas.height).toBe(400);
			expect(result.canvas.getContext("2d").drawImage).toHaveBeenCalledWith(image, 0, 0, 500, 400);
			expect(result.blob).toBe(blob);
			expect(encodeSpy.mock.instances[0]).toBe(result.canvas);
			expect(encodeSpy).toHaveBeenCalledWith(expect.any(Function), "image/jpeg", 1);
		});

		it("should preserve the resampleImage blob API", async () => {
			const blob = new Blob(["png"], { type: "image/png" });
			jest.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => callback(blob));

			expect(await ImageHelper.resampleImage(new Image(100, 100), { scale: 1, type: "image/png" })).toBe(blob);
		});
	});

	describe("compressToTargetSize", () => {
		it("should select a quality that fits the limit without redrawing the canvas", async () => {
			const canvas = document.createElement("canvas");
			const encodeSpy = jest.spyOn(canvas, "toBlob").mockImplementation((callback, _type, quality) => {
				callback(new Blob([new Uint8Array(Math.ceil(Number(quality) * 2048))], { type: "image/jpeg" }));
			});

			const result = await ImageHelper.compressToTargetSize(canvas, { fileSize: 0.6 });

			expect(result.size).toBeLessThanOrEqual(0.6 * 1024);
			expect(result.size).toBeGreaterThan(0.5 * 1024);
			expect(encodeSpy.mock.calls.length).toBeLessThanOrEqual(6);
			expect(canvas.getContext("2d").drawImage).not.toHaveBeenCalled();
		});

		it("should keep the best fitting result when a later attempt exceeds the limit", async () => {
			const canvas = document.createElement("canvas");
			const fitting = new Blob([new Uint8Array(512)]);
			const oversized = new Blob([new Uint8Array(2048)]);
			jest.spyOn(canvas, "toBlob")
				.mockImplementationOnce((callback) => callback(fitting))
				.mockImplementationOnce((callback) => callback(oversized));

			expect(await ImageHelper.compressToTargetSize(canvas, { fileSize: 1, maxAttempts: 2 })).toBe(fitting);
		});

		it("should return the smallest result when the target cannot be reached", async () => {
			const canvas = document.createElement("canvas");
			const smallest = new Blob([new Uint8Array(2048)]);
			const larger = new Blob([new Uint8Array(4096)]);
			const encodeSpy = jest
				.spyOn(canvas, "toBlob")
				.mockImplementationOnce((callback) => callback(larger))
				.mockImplementationOnce((callback) => callback(smallest))
				.mockImplementationOnce((callback) => callback(larger));

			expect(await ImageHelper.compressToTargetSize(canvas, { fileSize: 1, maxAttempts: 3 })).toBe(smallest);
			expect(encodeSpy).toHaveBeenCalledTimes(3);
		});

		it("should make at least one encoding attempt", async () => {
			const canvas = document.createElement("canvas");
			const blob = new Blob(["jpeg"]);
			const encodeSpy = jest.spyOn(canvas, "toBlob").mockImplementation((callback) => callback(blob));

			expect(await ImageHelper.compressToTargetSize(canvas, { fileSize: 1, maxAttempts: 0 })).toBe(blob);
			expect(encodeSpy).toHaveBeenCalledTimes(1);
		});
	});
});
