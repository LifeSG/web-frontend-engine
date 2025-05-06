import { IImage, ISharedImageProps, TFileCapture } from "../../types";
interface IProps extends Omit<ISharedImageProps, "maxSizeInKb"> {
    activeFileIndex: number;
    capture?: TFileCapture;
    images: IImage[];
    onClickThumbnail: (index: number) => void;
    onSelectFile: (files: File[]) => void;
    multiple?: boolean | undefined;
}
export declare const ImageThumbnails: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
