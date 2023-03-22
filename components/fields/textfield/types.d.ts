import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface ITextfieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"text", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
}
export interface IEmailSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"email", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
}
export interface INumberSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"numeric", V>, TComponentOmitProps<FormInputProps, "type" | "max" | "min"> {
}
