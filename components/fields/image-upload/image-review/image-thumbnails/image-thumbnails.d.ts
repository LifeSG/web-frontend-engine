import { TFileCapture } from "../../../../shared";
import { IImage, ISharedImageProps } from "../../types";
interface IProps extends Omit<ISharedImageProps, "maxSizeInKb"> {
    activeFileIndex: number;
    capture?: TFileCapture;
    images: IImage[];
    onClickThumbnail: (index: number) => void;
    onSelectFile: (file: File) => void;
}
export declare const ImageThumbnails: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
