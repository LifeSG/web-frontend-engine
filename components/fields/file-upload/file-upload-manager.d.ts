import { IFileUploadSchema, IFileUploadValidationRule, IFileUploadValue } from "./types";
interface IProps {
    fileTypeRule: IFileUploadValidationRule;
    id: string;
    maxFileSizeRule: IFileUploadValidationRule;
    upload: IFileUploadSchema["uploadOnAddingFile"];
    value: IFileUploadValue[];
}
export declare const FileUploadManager: (props: IProps) => any;
export {};
