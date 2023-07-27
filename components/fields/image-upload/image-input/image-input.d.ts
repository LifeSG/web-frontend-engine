import { IImageUploadValidationRule, ISharedImageProps } from "../types";
interface IImageInputProps extends ISharedImageProps {
    label: string;
    buttonLabel?: string | undefined;
    description?: string | undefined;
    dimensions: {
        width: number;
        height: number;
    };
    validation: IImageUploadValidationRule[];
    errorMessage?: string | undefined;
}
/**
 * handles adding of image(s) through drag & drop or file dialog
 */
export declare const ImageInput: (props: IImageInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
