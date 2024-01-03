import React, { Dispatch, SetStateAction } from "react";
import { IImage } from "../types";
interface IImageContext {
    images: IImage[];
    setImages: Dispatch<SetStateAction<IImage[]>>;
    errorCount: number;
    setErrorCount: Dispatch<SetStateAction<number>>;
}
interface Props {
    children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}
export declare const ImageContext: React.Context<IImageContext>;
export declare const ImageProvider: ({ children }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
