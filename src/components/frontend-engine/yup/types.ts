import * as Yup from "yup";

export const YUP_TYPES = ["string", "number", "boolean", "array", "object"] as const;
export const YUP_CONDITIONS = ["required", "length", "min", "max", "matches", "email", "url", "uuid", "when"] as const;
export type TYupSchemaType = typeof YUP_TYPES[number];
export type TYupCondition = typeof YUP_CONDITIONS[number];

export interface IYupRule {
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
					then: Omit<IYupRule, "when">[];
					otherwise?: Omit<IYupRule, "when">[];
				};
		  }
		| undefined;
	errorMessage?: string | undefined;
}

export interface IFieldYupConfig {
	schema: Yup.AnySchema;
	validationRules: IYupRule[];
}

export type TFormYupConfig = Record<string, IFieldYupConfig>;
