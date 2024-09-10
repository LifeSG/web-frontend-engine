export declare namespace FileHelper {
    /**
     * truncate file name according to wrapping element width
     */
    const truncateFileName: (fileName: string, widthOfElement: number) => string;
    /**
     * converts file/blob to dataURL
     */
    const fileToDataUrl: (file: File | Blob) => Promise<string>;
    /**
     * converts dataURL to blob
     */
    const dataUrlToBlob: (dataUrl: string) => Promise<Blob>;
    /**
     * estimate filesize from base64 string
     * https://stackoverflow.com/questions/53228948/how-to-get-image-file-size-from-base-64-string-in-javascript#answer-53229045
     */
    const getFilesizeFromBase64: (base64: string) => number;
    /**
     * convert array of file extensions to a proper sentence
     * convert to uppercase
     * joins array with comma
     * add `or` before last extension
     * lists both .JPG and .JPEG
     */
    const extensionsToSentence: (list: string[]) => string;
    /**
     * converts file extension to mime type
     */
    const fileExtensionToMimeType: (ext: string) => string | undefined;
    /**
     * reliably derive file type by checking magic number of the buffer
     */
    const getType: (file: Blob | File) => Promise<{
        mime: string;
        ext: string;
    }>;
    /**
     * ensure file name is unique against a list of file names
     */
    const deduplicateFileName: (fileNameList: string[], index: number, fileName: string, originalFilename?: string, counter?: number) => string;
    const blobToFile: (blob: Blob, metadata: {
        name: string;
        lastModified: number;
    }) => File;
}
