import { ISharedImageProps, TImageUploadOutputFileType, TUploadMethod } from "../types";
interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
    editImage: boolean;
    compress: boolean;
    crop: boolean;
    dimensions: {
        width: number;
        height: number;
    };
    outputType: TImageUploadOutputFileType;
    upload?: {
        method: TUploadMethod;
        url: string;
        sessionId?: string | undefined;
    };
    value: any;
}
/**
 * manages selected images by listening to images from context provider
 * rename / compress / upload
 */
export declare const ImageManager: (props: IProps) => any;
export {};
