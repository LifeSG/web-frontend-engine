import { ISharedImageProps, TFileCapture } from "../types";
interface IProps extends ISharedImageProps {
    capture?: TFileCapture | undefined;
    className?: string | undefined;
    compress?: boolean | undefined;
    dimensions: {
        width: number;
        height: number;
    };
    onExit: () => void;
    outputType: string;
    show: boolean;
    multiple?: boolean | undefined;
    maxFilesErrorMessage?: string | undefined;
    imageReviewModalStyles?: string | undefined;
}
export declare const ImageReview: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
