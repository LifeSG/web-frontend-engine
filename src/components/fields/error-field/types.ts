import type { TBlockElementSchema, TInlineElementSchema } from "../../elements";
import { IBaseFieldSchema } from "../types";

export interface IErrorFieldValidationRule {
	/** for customising error message when field is present, not visible to user */
	error?: boolean | undefined;
	errorMessage?: string | undefined;
}

export interface IErrorFieldSchema
	extends Pick<IBaseFieldSchema<"error-field", undefined, IErrorFieldValidationRule>, "showIf" | "uiType"> {
	validation?: [IErrorFieldValidationRule] | undefined;
	children?: Record<string, TBlockElementSchema | TInlineElementSchema> | undefined;
}
