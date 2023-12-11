import { IImageUploadValidationRule, ISharedImageProps } from "../types";
interface IImageInputProps extends ISharedImageProps {
    buttonLabel?: string | undefined;
    className?: string | undefined;
    description?: string | undefined;
    dimensions: {
        width: number;
        height: number;
    };
    errorMessage?: string | undefined;
    label: string;
    validation: IImageUploadValidationRule[];
}
/**
 * handles adding of image(s) through drag & drop or file dialog
 */
export declare const ImageInput: (props: IImageInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
