import ExifReader from "exifreader";
import { FileHelper } from "./file-helper";
import { IImageMetadata } from "../components/fields/image-upload";

export namespace ImageHelper {
	export const ensureDecodableBlob = async (blob: File | Blob, outputMimeType = "image/jpeg"): Promise<Blob> => {
		const inputMimeType = (await FileHelper.getType(blob)).mime;
		if (inputMimeType === "image/heic" || inputMimeType === "image/heif") {
			const { heicTo } = await import("heic-to/csp");
			return (await heicTo({
				blob: blob,
				type: outputMimeType as `image/${string}`,
			})) as Blob;
		}
		return blob;
	};

	/**
	 * convert image type
	 */
	export const convertBlob = async (blob: File | Blob, outputMimeType = "image/jpeg") => {
		const inputMimeType = (await FileHelper.getType(blob)).mime;
		if (inputMimeType === "image/heic" || inputMimeType === "image/heif") {
			const { heicTo } = await import("heic-to/csp");
			blob = (await heicTo({
				blob: blob,
				type: outputMimeType as `image/${string}`,
			})) as Blob;
		}

		const image = await blobToImage(blob);
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext("2d").drawImage(image, 0, 0);
		return canvas.toDataURL(outputMimeType);
	};

	/**
	 * converts dataURL to HTMLImageElement
	 */
	export const dataUrlToImage = async (dataURL: string): Promise<HTMLImageElement> => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => reject(new Error("dataURLtoImage(): dataURL is illegal"));
			image.src = dataURL;
		});
	};

	/**
	 * converts blob to HTMLImageElement
	 */
	export const blobToImage = async (blob: Blob): Promise<HTMLImageElement> => {
		const url = URL.createObjectURL(blob);
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => {
				URL.revokeObjectURL(url);
				resolve(image);
			};
			image.onerror = () => reject(new Error("blobToImage(): blob is illegal"));
			image.src = url;
		});
	};

	interface IBaseResampleOptions {
		quality?: number;
		type?: string;
	}
	interface IResampleOptionsWithScale extends IBaseResampleOptions {
		scale: number;
		crop?: never | undefined;
		width?: never | undefined;
		height?: never | undefined;
	}
	interface IResampleOptionsWithDimensions extends IBaseResampleOptions {
		scale?: never | undefined;
		width: number;
		height: number;
		crop?: boolean | undefined;
	}

	const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("canvasToBlob(): failed to encode canvas"));
					}
				},
				type,
				quality
			);
		});
	};

	/**
	 * resamples image by rendering it on canvas and returns both the rendered canvas and encoded blob
	 */
	export const resampleToCanvas = async (
		image: HTMLImageElement,
		options: IResampleOptionsWithScale | IResampleOptionsWithDimensions
	): Promise<{ canvas: HTMLCanvasElement; blob: Blob }> => {
		const { crop, scale, width, height, quality = 1, type = "image/jpeg" } = options;
		const cvs = document.createElement("canvas");
		const ctx = cvs.getContext("2d");

		if (scale) {
			cvs.width = image.width * scale;
			cvs.height = image.height * scale;
			ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
		} else if (width && height) {
			cvs.width = width;
			cvs.height = height;

			let sw = (image.height / height) * width;
			let sh = image.height;
			let sx = (image.width - sw) / 2;
			let sy = 0;
			if ((crop && image.height > image.width) || (!crop && image.height < image.width)) {
				sw = image.width;
				sh = (image.width / width) * height;
				sx = 0;
				sy = (image.height - sh) / 2;
			}

			ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
		}

		return { canvas: cvs, blob: await canvasToBlob(cvs, type, quality) };
	};

	/**
	 * resamples image by rendering it on canvas
	 */
	export const resampleImage = async (
		image: HTMLImageElement,
		options: IResampleOptionsWithScale | IResampleOptionsWithDimensions
	): Promise<Blob> => {
		const { blob } = await resampleToCanvas(image, options);
		return blob;
	};

	/**
	 * Compresses an image to the desired filesize using a binary search over encoder quality.
	 * When passed a canvas, its existing pixel data is reused without decoding or drawing again.
	 *
	 * fileSize is in kb
	 * optional `maxAttempts` to limit the attempts, if file size still exceeds at the end of it, return the best compressed image
	 */
	export const compressImage = async (
		input: File | Blob | HTMLCanvasElement,
		options: {
			fileSize: number;
			maxAttempts?: number;
			type?: string;
			onAttempt?: (attempt: number, quality: number, outputSize: number) => void;
		}
	): Promise<File | Blob> => {
		const { fileSize, maxAttempts = 6, type = "image/jpeg", onAttempt } = options;
		const targetBytes = fileSize * 1024;
		const attempts = Math.max(1, maxAttempts);

		let canvas: HTMLCanvasElement;
		if (input instanceof HTMLCanvasElement) {
			canvas = input;
		} else {
			if (input.size <= targetBytes) return input;

			const image = await blobToImage(input);
			canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			canvas.getContext("2d").drawImage(image, 0, 0);
		}

		let low = 0;
		let high = 1;
		let smallest: Blob | undefined;
		let bestWithinTarget: Blob | undefined;

		for (let attempt = 0; attempt < attempts; attempt++) {
			const quality = (low + high) / 2;
			const compressed = await canvasToBlob(canvas, type, quality);
			onAttempt?.(attempt + 1, quality, compressed.size);

			if (!smallest || compressed.size < smallest.size) smallest = compressed;

			if (compressed.size <= targetBytes) {
				// This quality fits; look for the highest quality that still does.
				bestWithinTarget = compressed;
				low = quality;
			} else {
				high = quality;
			}

			if (high - low < 0.05) break;
		}

		const result = bestWithinTarget || (smallest as Blob);
		return result;
	};

	export const getMetadata = async (file: File): Promise<IImageMetadata> => {
		try {
			const metadata = await ExifReader.load(file);
			const dateTimeOriginal = metadata["DateTimeOriginal"]?.description;
			const longitude = Number(metadata["GPSLongitude"]?.description);
			const latitude = Number(metadata["GPSLatitude"]?.description);

			const lng = !isNaN(longitude) ? Number(longitude) : undefined;
			const lat = !isNaN(latitude) ? Number(latitude) : undefined;
			return { dateTimeOriginal, lat, lng };
		} catch {}
	};
}
