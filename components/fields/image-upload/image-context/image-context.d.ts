import { Dispatch, SetStateAction } from "react";
import { IImage } from "../types";
interface IImageContext {
    images: IImage[];
    setImages: Dispatch<SetStateAction<IImage[]>>;
    errorCount: number;
    setErrorCount: Dispatch<SetStateAction<number>>;
    currentFileIds: string[];
    setCurrentFileIds: Dispatch<SetStateAction<string[]>>;
}
interface Props {
    children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}
export declare const ImageContext: import("react").Context<IImageContext>;
export declare const ImageProvider: ({ children }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
