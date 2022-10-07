import * as Yup from "yup";

export const VALIDATION_TYPES = ["string", "number", "boolean", "array", "object"] as const;
export const VALIDATION_CONDITIONS = [
	"required",
	"length",
	"min",
	"max",
	"matches",
	"email",
	"url",
	"uuid",
] as const;
export type TValidationType = typeof VALIDATION_TYPES[number];
export type TValidationCondition = typeof VALIDATION_CONDITIONS[number];

export interface IValidationRule {
	required?: boolean;
	length?: number;
	min?: number;
	max?: number;
	matches?: string;
	email?: boolean;
	url?: boolean;
	uuid?: boolean;
	errorMessage?: string;
}

export interface IFieldValidationConfig {
	schema: Yup.AnySchema;
	validationRules: IValidationRule[];
}

export type TFormValidationConfig = Record<string, IFieldValidationConfig>;
