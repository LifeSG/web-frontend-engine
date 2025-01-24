import { EsignatureProps } from "@lifesg/react-design-system/e-signature";
import { IBaseFieldSchema } from "..";
import { IYupValidationRule } from "../../frontend-engine";
export interface IESignatureFieldValidationRule extends IYupValidationRule {
    /** for customising upload error message */
    upload?: boolean | undefined;
}
export interface IESignatureFieldSchema<V = undefined> extends IBaseFieldSchema<"e-signature-field", V, IESignatureFieldValidationRule>, Pick<EsignatureProps, "className" | "data-testid" | "description"> {
    upload?: {
        url: string;
        type: "base64" | "multipart";
    } | undefined;
}
export interface IESignatureValue {
    dataURL?: string | undefined;
    fileId: string;
    fileUrl?: string | undefined;
    uploadResponse?: unknown | undefined;
}
