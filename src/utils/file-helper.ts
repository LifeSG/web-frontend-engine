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

	export const bytesToSize = (bytes: number) => {
		const sizes = ["B", "KB", "MB", "GB", "TB"];
		let rounding = 1;
		if (bytes == 0) return "0 B";
		const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
		if (i === 0 || i === 1) rounding = 0;
		return Number(bytes / Math.pow(1024, i)).toFixed(rounding) + " " + sizes[i];
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
}
