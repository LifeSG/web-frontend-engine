import React from "react";
import { IImage, IImageUploadValidationRule, ISharedImageProps } from "../../types";
interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
    id?: string;
    index: number;
    fileItem: IImage;
    validation: IImageUploadValidationRule[];
    onDelete: (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare const FileItem: ({ id, index, fileItem, maxSizeInKb, accepts, onDelete, validation }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
