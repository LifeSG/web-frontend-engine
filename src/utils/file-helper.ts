import getFileInfo from "magic-bytes.js";

export namespace FileHelper {
	/**
	 * truncate file name according to wrapping element width
	 */
	export const truncateFileName = (
		fileName: string,
		ref?: React.MutableRefObject<HTMLDivElement | HTMLParagraphElement> | undefined
	) => {
		let truncatedFileName = fileName;
		let widthOfElement = 0;
		let context: CanvasRenderingContext2D;

		if (ref && ref.current) {
			context = getContext(ref.current);
			widthOfElement = ref.current.getBoundingClientRect().width;
		}

		if (context && context.measureText(fileName).width > widthOfElement) {
			const ellipsis = "...";
			let prefix = "";
			let suffix = "";
			let startIndex = 0;
			let endIndex = fileName.length - 1;
			let current = ellipsis || "";
			let prev = current;

			while (startIndex < endIndex) {
				prefix = prefix + fileName.charAt(startIndex);
				current = prefix + ellipsis + suffix;
				if (context.measureText(current).width > widthOfElement) {
					truncatedFileName = prev;
					break;
				}
				prev = current;
				suffix = fileName.charAt(endIndex) + suffix;
				current = prefix + ellipsis + suffix;
				if (context.measureText(current).width > widthOfElement) {
					truncatedFileName = prev;
					break;
				}
				prev = current;
				startIndex++;
				endIndex--;
			}
		}

		return truncatedFileName;
	};

	/**
	 * create element and get context
	 */
	const getContext = (ref: HTMLDivElement | HTMLParagraphElement) => {
		const fragment = document.createDocumentFragment();
		const canvas = document.createElement("canvas");
		fragment.appendChild(canvas);
		const context = canvas.getContext("2d");
		const computedStyles = window.getComputedStyle(ref);
		context.font = computedStyles.font
			? computedStyles.font
			: `${computedStyles.fontSize}" "${computedStyles.fontFamily}`;
		return context;
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
	 * estimate filesize (in terms of bytes) from base64 string
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
	 * reliably derive file type by checking magic number of the buffer
	 */
	export const getType = async (file: Blob | File) => {
		const arrayBuffer = await file.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);
		const [fileInfo] = getFileInfo(bytes);
		return {
			mime: fileInfo?.mime,
			ext: fileInfo?.extension === "jpeg" ? "jpg" : fileInfo?.extension,
		};
	};

	/**
	 * ensure file name is unique against a list of file names
	 */
	export const deduplicateFileName = (
		fileNameList: string[],
		index: number,
		fileName: string,
		originalFilename = fileName,
		counter = 1
	): string => {
		const hasSameName = fileNameList.filter((f, i) => i !== index).includes(fileName);
		if (hasSameName) {
			const name = originalFilename.split(".");
			const ext = name.pop();
			if (!ext) return fileName;
			fileName = name.join().concat(` (${counter}).`).concat(ext);
			return deduplicateFileName(fileNameList, index, fileName, originalFilename, ++counter);
		} else {
			return fileName;
		}
	};

	export const blobToFile = (blob: Blob, metadata: { name: string; lastModified: number }): File => {
		const { name, lastModified } = metadata;
		return new File([blob], name, {
			type: blob.type,
			lastModified,
		});
	};
}
