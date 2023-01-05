import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface ITextfieldSchema
	extends IFrontendEngineFieldJsonSchema<"text">,
		TComponentNativeProps<FormInputProps, "type"> {}

export interface IEmailSchema
	extends IFrontendEngineFieldJsonSchema<"email">,
		TComponentNativeProps<FormInputProps, "type"> {}

export interface INumberSchema
	extends IFrontendEngineFieldJsonSchema<"numeric">,
		TComponentNativeProps<FormInputProps, "type" | "maxLength" | "max" | "min"> {}
