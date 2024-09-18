import { IYupValidationRule } from "../../frontend-engine/types";
import { IBaseFieldSchema } from "../types";

export interface IErrorFieldValidationRule extends IYupValidationRule {
	/** for customising error message when field is present, not visible to user */
	error?: boolean | undefined;
}

export interface IErrorFieldSchema
	extends Pick<
		IBaseFieldSchema<"error-field", undefined, IErrorFieldValidationRule>,
		"showIf" | "uiType" | "validation"
	> {}
