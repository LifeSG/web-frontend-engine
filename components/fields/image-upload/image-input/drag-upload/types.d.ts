/// <reference types="react" />
import { TFileCapture, TImageUploadAcceptedFileType } from "../../types";
export interface IDragUploadRef {
    fileDialog: () => unknown;
}
export interface IDragUploadProps {
    id?: string | undefined;
    capture?: TFileCapture;
    className?: string | undefined;
    /** applies to input field only and not for drag & drop */
    accept?: TImageUploadAcceptedFileType[] | undefined;
    children: React.ReactNode;
    hint?: string | undefined;
    onInput: (files: File[]) => void;
    multiple?: boolean | undefined;
}
