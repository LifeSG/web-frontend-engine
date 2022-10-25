import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ITextfieldSchema
	extends IFrontendEngineBaseFieldJsonSchema<"text">,
		Omit<FormInputProps, TFrontendEngineBaseFieldJsonSchemaKeys | "type"> {}

export interface IEmailSchema
	extends IFrontendEngineBaseFieldJsonSchema<"email">,
		Omit<FormInputProps, TFrontendEngineBaseFieldJsonSchemaKeys | "type"> {}

export interface INumberSchema
	extends IFrontendEngineBaseFieldJsonSchema<"number">,
		Omit<FormInputProps, TFrontendEngineBaseFieldJsonSchemaKeys | "type" | "maxLength" | "max" | "min"> {}
