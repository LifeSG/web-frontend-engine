import { IBaseFieldSchema } from "../types";
export interface IHiddenFieldSchema<V = undefined> extends Pick<IBaseFieldSchema<"hidden-field", V>, "showIf" | "validation" | "uiType"> {
    valueType?: "string" | "number" | "boolean" | undefined;
}
