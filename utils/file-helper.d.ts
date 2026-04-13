export declare namespace FileHelper {
    /**
     * truncate file name according to wrapping element width
     */
    export const truncateFileName: (fileName: string, ref?: React.MutableRefObject<HTMLDivElement | HTMLParagraphElement> | undefined) => string;
    /**
     * converts file/blob to dataURL
     */
    export const fileToDataUrl: (file: File | Blob) => Promise<string>;
    /**
     * converts dataURL to blob
     */
    export const dataUrlToBlob: (dataUrl: string) => Promise<Blob>;
    /**
     * estimate filesize (in terms of bytes) from base64 string
     * https://stackoverflow.com/questions/53228948/how-to-get-image-file-size-from-base-64-string-in-javascript#answer-53229045
     */
    export const getFilesizeFromBase64: (base64: string) => number;
    /**
     * convert array of file extensions to a proper sentence
     * convert to uppercase
     * joins array with comma
     * add `or` before last extension
     */
    export const extensionsToSentence: (list: string[], options?: {
        setBothJpegAndJpgIfEitherExists?: boolean;
    }) => string;
    const setBothJpegAndJpgIfEitherExists: (list: string[]) => string[];
    /**
     * converts file extension to mime type
     */
    export const fileExtensionToMimeType: (ext: string) => string | undefined;
    /**
     * reliably derive file type by checking magic number of the buffer
     */
    export const getType: (file: Blob | File) => Promise<import("file-type").FileTypeResult | {
        mime: string;
        ext: string;
    }>;
    /**
     * ensure file name is unique against a list of file names
     */
    export const deduplicateFileName: (fileNameList: string[], index: number, fileName: string, originalFilename?: string, counter?: number) => string;
    export const sanitizeFileName: (fileName: string) => string;
    export const blobToFile: (blob: Blob, metadata: {
        name: string;
        lastModified: number;
    }) => File;
    export {};
}
