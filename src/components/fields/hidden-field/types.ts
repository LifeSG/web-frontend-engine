import { IYupValidationRule } from "../../types";
import { IBaseFieldSchema } from "../types";

export interface IHiddenFieldValidationRule extends IYupValidationRule {
	/** for customising error message when submitted value does not match schema value */
	matchesSchema?: boolean | undefined;
}

type StringField = {
	valueType: "string";
	value?: string;
};

type NumberField = {
	valueType: "number";
	value?: number;
};

type BooleanField = {
	valueType: "boolean";
	value?: boolean;
};

type NoValueField = {
	valueType?: never | undefined;
	value?: never | undefined;
};

type FieldType = StringField | NumberField | BooleanField | NoValueField;

export type THiddenFieldSchema<V = undefined> = Pick<
	IBaseFieldSchema<"hidden-field", V, IHiddenFieldValidationRule>,
	"showIf" | "validation" | "uiType"
> &
	FieldType;

/** @deprecated use THiddenFieldSchema */
export type IHiddenFieldSchema<V = undefined> = THiddenFieldSchema<V>;
