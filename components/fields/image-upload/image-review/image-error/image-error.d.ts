import React from "react";
import { IImage, ISharedImageProps } from "../../types";
interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
    image: IImage;
    onClickOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
    maxFilesErrorMessage?: string | undefined;
    maxFiles?: number | undefined;
}
export declare const ImageError: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
