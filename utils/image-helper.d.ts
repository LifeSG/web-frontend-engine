export declare namespace ImageHelper {
    /**
     * convert image type
     */
    export const convertBlob: (blob: File | Blob, outputMimeType?: string) => Promise<string>;
    /**
     * converts dataURL to HTMLImageElement
     */
    export const dataUrlToImage: (dataURL: string) => Promise<HTMLImageElement>;
    /**
     * converts blob to HTMLImageElement
     */
    export const blobToImage: (blob: Blob) => Promise<HTMLImageElement>;
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
    /**
     * resamples image by rendering it on canvas
     */
    export const resampleImage: (image: HTMLImageElement, options: IResampleOptionsWithScale | IResampleOptionsWithDimensions) => Promise<Blob>;
    /**
     * rescursively attempt to compress image till the desired filesize
     *
     * fileSize is in kb
     * optional `maxAttempts` to limit the attempts, if file size still exceeds at the end of it, return the best compressed image
     */
    export const compressImage: (file: File | Blob, options: {
        quality?: number;
        fileSize: number;
        attempts?: number;
        maxAttempts?: number;
    }) => any;
    export {};
}
