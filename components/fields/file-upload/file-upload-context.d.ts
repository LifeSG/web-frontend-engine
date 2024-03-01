import { Dispatch, SetStateAction } from "react";
import { IFile } from "./types";
interface IFileUploadContext {
    files: IFile[];
    setFiles: Dispatch<SetStateAction<IFile[]>>;
}
interface Props {
    children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}
export declare const FileUploadContext: import("react").Context<IFileUploadContext>;
export declare const FileUploadProvider: ({ children }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
