import { IFileUploadSchema, IFileUploadValidationRule, IFileUploadValue } from "./types";
interface IProps {
    compressImages: boolean;
    fileTypeRule: IFileUploadValidationRule;
    id: string;
    maxFileSizeRule: IFileUploadValidationRule;
    upload: IFileUploadSchema["uploadOnAddingFile"];
    value: IFileUploadValue[];
}
declare const FileUploadManager: (props: IProps) => any;
export default FileUploadManager;
