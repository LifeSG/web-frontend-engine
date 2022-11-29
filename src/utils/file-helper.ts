import { fromBlob } from "file-type/browser";

export namespace FileHelper {
	/**
	 * truncate file name according to wrapping element width
	 */
	export const truncateFileName = (fileName: string, widthOfElement: number) => {
		// every 8px increment ~= 1 char width
		// TODO: how to better determine char width?
		const threshold = Math.floor(widthOfElement / 8);
		const ellipsis = "...";
		const length = fileName.length + ellipsis.length;
		if (length > threshold) {
			const thresholdIndex = threshold / 2;
			return fileName.substring(0, thresholdIndex) + ellipsis + fileName.substring(length - thresholdIndex);
		}

		return fileName;
	};

	/**
	 * formats bytes to bigger units
	 */
	export const bytesToSize = (bytes: number) => {
		const sizes = ["B", "KB", "MB", "GB", "TB"];
		let rounding = 1;
		if (bytes == 0) return "0 B";
		const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
		if (i === 0 || i === 1) rounding = 0;
		return Number(bytes / Math.pow(1024, i)).toFixed(rounding) + " " + sizes[i];
	};

	/**
	 * converts file/blob to dataURL
	 */
	export const fileToDataUrl = async (file: File | Blob): Promise<string> => {
		if (!window || !window.FileReader) return; // do not run in SSR
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	/**
	 * converts dataURL to blob
	 */
	export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
		return (await fetch(dataUrl)).blob();
	};

	/**
	 * estimate filesize from base64 string
	 * https://stackoverflow.com/questions/53228948/how-to-get-image-file-size-from-base-64-string-in-javascript#answer-53229045
	 */
	export const getFilesizeFromBase64 = (base64: string): number => {
		const length = base64.length;
		const padding = base64.substring(length - 2, 2).match(/=/g)?.length || 0;
		return length * 0.75 - padding;
	};

	/**
	 * convert array of file extensions to a proper sentence
	 * convert to uppercase
	 * joins array with comma
	 * add `or` before last extension
	 * lists both .JPG and .JPEG
	 */
	export const extensionsToSentence = (list: string[]) => {
		const formattedList = list.map((extension) => `.${extension.toUpperCase()}`);
		const jpgIndex = formattedList.indexOf(".JPG");
		if (jpgIndex > -1) formattedList.splice(jpgIndex + 1, 0, ".JPEG");
		return new Intl.ListFormat("en-GB", { style: "long", type: "disjunction" }).format(formattedList);
	};

	/**
	 * converts file extension to mime type
	 */
	export const fileExtensionToMimeType = (ext: string): string | undefined => {
		switch (ext.toLowerCase()) {
			case "jpg":
			case "jpeg":
				return "image/jpeg";
			case "png":
				return "image/png";
			case "gif":
				return "image/gif";
			case "heic":
				return "image/heic";
			case "heif":
				return "image/heif";
			case "webp":
				return "image/webp";
		}
	};

	/**
	 * reliably derive mime type by checking magic number of the buffer
	 */
	export const getMimeType = async (blob: Blob | File) => {
		const result = await fromBlob(blob);
		return result?.mime;
	};
}
