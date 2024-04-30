import { IImageUploadValidationRule, ISharedImageProps, TFileCapture } from "../types";
interface IImageInputProps extends ISharedImageProps {
    buttonLabel?: string | undefined;
    capture?: TFileCapture | undefined;
    className?: string | undefined;
    description?: string | undefined;
    dimensions: {
        width: number;
        height: number;
    };
    errorMessage?: string | undefined;
    label: string;
    validation: IImageUploadValidationRule[];
    multiple?: boolean | undefined;
}
/**
 * handles adding of image(s) through drag & drop or file dialog
 */
export declare const ImageInput: (props: IImageInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
