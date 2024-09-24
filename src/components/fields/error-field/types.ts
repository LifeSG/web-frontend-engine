import type { IAlertSchema, IOrderedListSchema, ITextSchema, IUnorderedListSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import { IBaseFieldSchema } from "../types";

export interface IErrorFieldValidationRule {
	/** for customising error message when field is present, not visible to user */
	error?: boolean | undefined;
	errorMessage?: string | undefined;
}

type TErrorFieldChildren = IAlertSchema | ITextSchema | IWrapperSchema | IOrderedListSchema | IUnorderedListSchema;

export interface IErrorFieldSchema
	extends Pick<IBaseFieldSchema<"error-field", undefined, IErrorFieldValidationRule>, "showIf" | "uiType"> {
	validation?: [IErrorFieldValidationRule] | undefined;
	children?: Record<string, TErrorFieldChildren> | undefined;
}
