import * as Yup from "yup";

export const YUP_TYPES = ["string", "number", "boolean", "array", "object"] as const;
export const YUP_CONDITIONS = [
	"required",
	"length",
	"min",
	"max",
	"matches",
	"email",
	"url",
	"uuid",
	"when",
	"filled",
	"empty",
	"equals",
	"notEquals",
	"includes",
	"excludes",
	"uinfin",
] as const;
export type TYupSchemaType = typeof YUP_TYPES[number];
export type TYupCondition = typeof YUP_CONDITIONS[number];

interface IYupRule {
	length?: number | undefined;
	min?: number | undefined;
	max?: number | undefined;
	matches?: string | undefined;
	email?: boolean | undefined;
	url?: boolean | undefined;
	uuid?: boolean | undefined;
	empty?: boolean | undefined;
	equals?: unknown | undefined;
	notEquals?: unknown | undefined;
	includes?: unknown | undefined;
	excludes?: unknown | undefined;
	uinfin?: boolean | undefined;
}

export interface IYupValidationRule extends IYupRule {
	required?: boolean | undefined;
	when?:
		| {
				[id: string]: {
					is: string | number | boolean | string[] | number[] | boolean[] | IYupConditionalValidationRule[];
					then: Omit<IYupValidationRule, "when">[];
					otherwise?: Omit<IYupValidationRule, "when">[];
				};
		  }
		| undefined;
	errorMessage?: string | undefined;
}

export interface IYupConditionalValidationRule extends IYupRule {
	filled?: boolean | undefined;
}

export interface IYupRenderRule extends IYupRule {
	filled?: boolean | undefined;
}

export type TRenderRules = Record<string, IYupRenderRule[]>;

export interface IFieldYupConfig {
	schema: Yup.AnySchema;
	validationRules: IYupValidationRule[];
}

export type TFormYupConfig = Record<string, IFieldYupConfig>;
