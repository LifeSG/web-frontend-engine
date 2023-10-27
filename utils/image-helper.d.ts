export declare namespace ImageHelper {
    /**
     * convert image type
     */
    const convertBlob: (blob: File | Blob, outputMimeType?: string) => Promise<string>;
    /**
     * converts dataURL to HTMLImageElement
     */
    const dataUrlToImage: (dataURL: string) => Promise<HTMLImageElement>;
    /**
     * converts blob to HTMLImageElement
     */
    const blobToImage: (blob: Blob) => Promise<HTMLImageElement>;
    /**
     * resamples image by rendering it on canvas
     */
    const resampleImage: (image: HTMLImageElement, options: {
        scale: number;
        quality?: number;
        type?: string;
    }) => Promise<Blob>;
    /**
     * rescursively attempt to compress image till the desired filesize
     *
     * fileSize is in kb
     * optional `maxAttempts` to limit the attempts, if file size still exceeds at the end of it, return the best compressed image
     */
    const compressImage: (file: File | Blob, options: {
        quality?: number;
        fileSize: number;
        attempts?: number;
        maxAttempts?: number;
    }) => any;
}
