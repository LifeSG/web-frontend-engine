import { fileTypeFromBuffer } from "file-type";

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
	 */
	export const extensionsToSentence = (list: string[], options?: { setBothJpegAndJpgIfEitherExists?: boolean }) => {
		let formattedList = list.map((extension) => `.${extension.toUpperCase()}`);

		if (options?.setBothJpegAndJpgIfEitherExists) {
			formattedList = setBothJpegAndJpgIfEitherExists(formattedList);
		}

		return new Intl.ListFormat("en-GB", { style: "long", type: "disjunction" }).format(new Set(formattedList));
	};

	// ensures both .JPG and .JPEG are included if at least either one is included
	const setBothJpegAndJpgIfEitherExists = (list: string[]) => {
		const newList = [...list];

		const hasJpg = list.includes(".JPG");
		const hasJpeg = list.includes(".JPEG");

		// Return unchanged if both are present or neither is present
		if ((hasJpg && hasJpeg) || (!hasJpg && !hasJpeg)) {
			return newList;
		}

		const { index, toAdd } =
			newList.indexOf(".JPG") > -1
				? { index: newList.indexOf(".JPG"), toAdd: ".JPEG" }
				: { index: newList.indexOf(".JPEG"), toAdd: ".JPG" };

		newList.splice(index + 1, 0, toAdd);

		return newList;
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
	 * derive file type from the file's content (magic number)
	 * text-based formats have no magic number, so their type falls back to the browser-declared mime type and the
	 * file name's extension, both of which the uploader controls
	 * this is a client-side check for the user's convenience, not a security boundary: the server must validate content
	 */
	export const getType = async (file: Blob | File) => {
		const buffer = await file.arrayBuffer();
		const result = await fileTypeFromBuffer(buffer);

		// default to what is provided by the file as it is not possible to determine file type for text-based file formats
		if (!result && file.type.startsWith("text")) {
			const fileName = (file as File).name || ".txt";
			return {
				mime: file.type,
				ext: fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length),
			};
		}

		return result;
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
			fileName = name.join(".").concat(` (${counter}).`).concat(ext);
			return deduplicateFileName(fileNameList, index, fileName, originalFilename, ++counter);
		} else {
			return fileName;
		}
	};

	/**
	 * normalise an uploaded file's name before it is displayed and sent as the multipart filename
	 * keeps letters, digits, space, _ - ( ) and inner dots, so non-ascii characters don't break multipart encoding and
	 * path separators, traversal sequences and markup characters are removed
	 *
	 * this is not a security boundary: the client can be bypassed, so the server must not use the client-supplied
	 * name to build storage paths (store under a generated id instead) and must escape it wherever it is displayed
	 */
	export const sanitizeFileName = (fileName: string): string => {
		const parts = fileName.split(".");

		const cleanName = (value: string) =>
			value
				.replace(/[^A-Za-z0-9 _().-]/g, "") // allowlist, drops / \ < > : * ? " | and non-ascii
				.replace(/\.{2,}/g, ".") // collapse ".." so traversal can't survive
				.replace(/^[\s.]+|[\s.]+$/g, ""); // trim leading/trailing dots and spaces

		const cleanExt = (value: string) => value.replace(/[^A-Za-z0-9]/g, ""); // letters and digits only

		if (parts.length === 2 && parts[0] === "") {
			const name = cleanExt(parts[1]); // dotfile without extension e.g. .env, kept as is
			return name ? `.${name}` : "file";
		}

		const ext = parts.length > 1 ? cleanExt(parts.pop() ?? "") : ""; // last segment only, inner dots stay in the name
		const name = cleanName(parts.join(".")) || "file"; // e.g. "✨.txt" -> "file.txt"

		return ext ? `${name}.${ext}` : name;
	};

	/**
	 * whether a prefilled fileUrl may be fetched: http(s) only, relative urls resolve against the page
	 * http is kept for local dev; https pages already block it (mixed content)
	 * host restriction is left to the consumer's CSP connect-src
	 */
	export const isFetchableFileUrl = (url: unknown): boolean => {
		if (typeof url !== "string" || !url.trim()) return false;
		try {
			const { protocol } = new URL(url, window.location.href);
			return protocol === "https:" || protocol === "http:";
		} catch {
			return false;
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
