export declare namespace FileHelper {
    /**
     * truncate file name according to wrapping element width
     */
    const truncateFileName: (fileName: string, ref?: React.MutableRefObject<HTMLDivElement | HTMLParagraphElement> | undefined) => string;
    /**
     * converts file/blob to dataURL
     */
    const fileToDataUrl: (file: File | Blob) => Promise<string>;
    /**
     * converts dataURL to blob
     */
    const dataUrlToBlob: (dataUrl: string) => Promise<Blob>;
    /**
     * estimate filesize (in terms of bytes) from base64 string
     * https://stackoverflow.com/questions/53228948/how-to-get-image-file-size-from-base-64-string-in-javascript#answer-53229045
     */
    const getFilesizeFromBase64: (base64: string) => number;
    /**
     * convert array of file extensions to a proper sentence
     * convert to uppercase
     * joins array with comma
     * add `or` before last extension
     */
    const extensionsToSentence: (list: string[], options?: {
        setBothJpegAndJpgIfEitherExists?: boolean;
    }) => string;
    /**
     * converts file extension to mime type
     */
    const fileExtensionToMimeType: (ext: string) => string | undefined;
    /**
     * derive file type from the file's content (magic number)
     * text-based formats have no magic number, so their type falls back to the browser-declared mime type and the
     * file name's extension, both of which the uploader controls
     * this is a client-side check for the user's convenience, not a security boundary: the server must validate content
     */
    const getType: (file: Blob | File) => Promise<import("file-type").FileTypeResult>;
    /**
     * ensure file name is unique against a list of file names
     */
    const deduplicateFileName: (fileNameList: string[], index: number, fileName: string, originalFilename?: string, counter?: number) => string;
    /**
     * normalise an uploaded file's name before it is displayed and sent as the multipart filename
     * keeps letters, digits, space, _ - ( ) and inner dots, so non-ascii characters don't break multipart encoding and
     * path separators, traversal sequences and markup characters are removed
     *
     * this is not a security boundary: the client can be bypassed, so the server must not use the client-supplied
     * name to build storage paths (store under a generated id instead) and must escape it wherever it is displayed
     */
    const sanitizeFileName: (fileName: string) => string;
    /**
     * whether a prefilled fileUrl may be fetched: http(s) only, relative urls resolve against the page
     * http is kept for local dev; https pages already block it (mixed content)
     * host restriction is left to the consumer's CSP connect-src
     */
    const isFetchableFileUrl: (url: unknown) => boolean;
    const blobToFile: (blob: Blob, metadata: {
        name: string;
        lastModified: number;
    }) => File;
}
