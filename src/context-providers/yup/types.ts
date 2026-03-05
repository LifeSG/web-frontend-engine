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
	"positive",
	"negative",
	"integer",
	"lessThan",
	"moreThan",
	"when",
	"filled",
	"empty",
	"equals",
	"notEquals",
	"includes",
	"excludes",
	"uinfin",
	"equalsField",
	"withinDays",
] as const;
export type TYupSchemaType = (typeof YUP_TYPES)[number];
export type TYupCondition = (typeof YUP_CONDITIONS)[number];

interface IYupRule {
	length?: number | undefined;
	min?: number | undefined;
	max?: number | undefined;
	matches?: string | undefined;
	notMatches?: string | undefined;
	email?: boolean | undefined;
	url?: boolean | undefined;
	uuid?: boolean | undefined;
	positive?: boolean | undefined;
	negative?: boolean | undefined;
	integer?: boolean | undefined;
	lessThan?: number | undefined;
	moreThan?: number | undefined;
	empty?: boolean | undefined;
	equals?: unknown | undefined;
	notEquals?: unknown | undefined;
	includes?: unknown | undefined;
	excludes?: unknown | undefined;
	uinfin?: boolean | undefined;
	uen?: boolean | undefined;
	equalsField?: string | undefined;
	notEqualsField?: string | undefined;
	whitespace?: boolean | IWhitespaceRule | undefined;
	/**
	 * @deprecated Use `whitespace` rule instead.
	 */
	noWhitespaceOnly?: boolean | undefined;
}

/**
 * V and U generics are needed here to be passed into `then` and `otherwise` conditional validation
 * `V` - custom validation rules
 * `U` - custom validation rules defined by components, for internal use, prevents getting overwritten by custom validation rules
 */
export interface IYupValidationRule<V = undefined, U = undefined> extends IYupRule {
	required?: boolean | undefined;
	when?:
		| {
				[id: string]: {
					is: string | number | boolean | string[] | number[] | boolean[] | IYupConditionalValidationRule[];
					then: (IYupValidationRule<V, U> | V | U)[];
					otherwise?: (Omit<IYupValidationRule<V, U>, "when"> | V | U)[];
					yupSchema?: Yup.AnySchema | undefined;
				};
		  }
		| undefined;
	errorMessage?: string | undefined;
	soft?: boolean | undefined;
}

export interface IYupConditionalValidationRule extends IYupRule {
	filled?: boolean | undefined;
}

export interface IYupRenderRule extends IYupRule {
	filled?: boolean | undefined;
	shown?: boolean | undefined;
	withinDays?: IWithinDaysRangeRule | undefined;
	beyondDays?: IDaysRangeRule | undefined;
}

export type TRenderRules = Record<string, IYupRenderRule[]>;

export interface IFieldYupConfig {
	schema: Yup.AnySchema;
	validationRules: IYupValidationRule[];
}

export type TFormYupConfig = Record<string, IFieldYupConfig>;

export type TCustomValidationFunction = (value: unknown, arg: unknown, context: Yup.TestContext) => boolean;

export interface IDaysRangeRule {
	numberOfDays: number;
	fromDate?: string | undefined;
	dateFormat?: string | undefined;
}

export interface IWithinDaysRangeRule extends IDaysRangeRule {
	/** inclusive of today (or `fromDate` if specified). defaults to false, meaning today will fail validation */
	inclusive?: boolean;
}

export interface IWhitespaceRule {
	noLeadingOrTrailingWhitespace?: boolean | undefined;
}
