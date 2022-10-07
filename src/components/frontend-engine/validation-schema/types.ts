import * as Yup from "yup";

export const VALIDATION_TYPES = ["string", "number", "boolean", "array", "object"] as const;
export const VALIDATION_CONDITIONS = ["maxLength", "minLength", "maxValue", "minValue", "required"] as const;
export type TValidationType = typeof VALIDATION_TYPES[number];
export type TValidationCondition = typeof VALIDATION_CONDITIONS[number];

export interface IValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	minValue?: number;
	maxValue?: number;
	errorMessage?: string;
}

export interface IFieldValidationConfig {
	schema: Yup.AnySchema;
	validationRules: IValidationRule[];
}

export type TFormValidationConfig = Record<string, IFieldValidationConfig>;
