import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface ITextFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"text-field", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
}
export interface IEmailFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"email-field", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
}
export interface INumericFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"numeric-field", V>, TComponentOmitProps<FormInputProps, "type" | "max" | "min"> {
}
