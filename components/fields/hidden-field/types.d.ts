import { IYupValidationRule } from "../../types";
import { IBaseFieldSchema } from "../types";
export interface IHiddenFieldValidationRule extends IYupValidationRule {
    /** for customising error message when submitted value does not match schema value */
    equalsSchemaValue?: boolean | undefined;
}
type TStringField = {
    valueType: "string";
    value?: string | undefined;
};
type TNumberField = {
    valueType: "number";
    value?: number | undefined;
};
type TBooleanField = {
    valueType: "boolean";
    value?: boolean | undefined;
};
type TNullField = {
    valueType: "null";
    value?: null | undefined;
};
type TNoValueField = {
    valueType?: never | undefined;
    value?: never | undefined;
};
type TFieldType = TStringField | TNumberField | TBooleanField | TNullField | TNoValueField;
export type THiddenFieldSchema<V = undefined> = Pick<IBaseFieldSchema<"hidden-field", V, IHiddenFieldValidationRule>, "showIf" | "validation" | "uiType"> & TFieldType;
/** @deprecated use THiddenFieldSchema */
export type IHiddenFieldSchema<V = undefined> = THiddenFieldSchema<V>;
export {};
