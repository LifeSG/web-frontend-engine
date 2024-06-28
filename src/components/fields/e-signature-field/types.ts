import { EsignatureProps } from "@lifesg/react-design-system/e-signature";
import { IBaseFieldSchema } from "..";

export interface IESignatureFieldSchema<V = undefined>
	extends IBaseFieldSchema<"e-signature-field", V>,
		Pick<EsignatureProps, "className" | "data-testid" | "description"> {
	upload?: { url: string; type: "base64" | "multipart" } | undefined;
}

export interface IESignatureValue {
	fileId: string;
	dataURL: string;
	uploadResponse?: unknown | undefined;
}
