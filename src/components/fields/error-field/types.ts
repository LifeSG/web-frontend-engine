import { IBaseFieldSchema } from "../types";

export interface IErrorFieldValidationRule {
	/** for customising error message when field is present, not visible to user */
	error?: boolean | undefined;
	errorMessage?: string | undefined;
}

export interface IErrorFieldSchema extends Pick<IBaseFieldSchema<"error-field">, "showIf" | "uiType"> {
	validation?: [IErrorFieldValidationRule] | undefined;
}
