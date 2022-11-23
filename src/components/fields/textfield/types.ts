import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface ITextfieldSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"text", V>,
		TComponentOmitProps<FormInputProps, "type"> {}

export interface IEmailSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"email", V>,
		TComponentOmitProps<FormInputProps, "type"> {}

export interface INumberSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"numeric", V>,
		TComponentOmitProps<FormInputProps, "type" | "maxLength" | "max" | "min"> {}
