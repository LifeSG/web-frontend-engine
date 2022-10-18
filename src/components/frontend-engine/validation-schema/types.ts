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
	"when",
] as const;
export type TValidationType = typeof VALIDATION_TYPES[number];
export type TValidationCondition = typeof VALIDATION_CONDITIONS[number];

export interface IValidationRule {
	required?: boolean | undefined;
	length?: number | undefined;
	min?: number | undefined;
	max?: number | undefined;
	matches?: string | undefined;
	email?: boolean | undefined;
	url?: boolean | undefined;
	uuid?: boolean | undefined;
	when?:
		| {
				[id: string]: {
					is: string | number | boolean | string[] | number[] | boolean[];
					then: Omit<IValidationRule, "when">[];
					otherwise?: Omit<IValidationRule, "when">[];
				};
		  }
		| undefined;
	errorMessage?: string | undefined;
}

export interface IFieldValidationConfig {
	schema: Yup.AnySchema;
	validationRules: IValidationRule[];
}

export type TFormValidationConfig = Record<string, IFieldValidationConfig>;
