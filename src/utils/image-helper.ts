import { FileHelper } from "./file-helper";

export namespace ImageHelper {
	/**
	 * convert image type
	 */
	export const convertBlob = async (blob: File | Blob, outputMimeType = "image/jpeg") => {
		const inputMimeType = await FileHelper.getMimeType(blob);
		if (inputMimeType === "image/heic" || inputMimeType === "image/heif") {
			const { default: heic2any } = await import("heic2any"); // get around SSR
			blob = (await heic2any({ blob, toType: outputMimeType })) as File;
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

	/**
	 * resamples image by rendering it on canvas
	 */
	export const resampleImage = async (
		image: HTMLImageElement,
		options: { scale: number; quality?: number; type?: string }
	): Promise<Blob> => {
		const { scale, quality = 1, type = "image/jpeg" } = options;
		const cvs = document.createElement("canvas");
		const ctx = cvs.getContext("2d");

		cvs.width = image.width * scale;
		cvs.height = image.height * scale;
		ctx.drawImage(image, 0, 0, cvs.width, cvs.height);

		return new Promise((resolve) => cvs.toBlob((blob) => resolve(blob), type, quality));
	};

	/**
	 * rescursively attempt to compress image till the desired filesize
	 *
	 * fileSize is in kb
	 * optional `maxAttempts` to limit the attempts, if file size still exceeds at the end of it, return the best compressed image
	 */
	export const compressImage = async (
		file: File | Blob,
		options: { quality?: number; fileSize: number; attempts?: number; maxAttempts?: number }
	) => {
		const { quality = 1, fileSize, attempts = 0, maxAttempts } = options;
		const image = await blobToImage(file);

		if (file.size <= fileSize * 1024) return file;
		const compressed = await resampleImage(image, { scale: 1, quality });

		if (compressed.size > fileSize * 1024) {
			if (attempts < maxAttempts || !maxAttempts) {
				return compressImage(file, { ...options, quality: quality - 0.1, attempts: attempts + 1 });
			}
		}
		return compressed;
	};
}
