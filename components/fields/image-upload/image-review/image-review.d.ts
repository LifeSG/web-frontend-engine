import { TFileCapture } from "../../../shared";
import { ISharedImageProps } from "../types";
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
}
export declare const ImageReview: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
