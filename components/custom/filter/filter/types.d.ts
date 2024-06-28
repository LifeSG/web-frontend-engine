import { ICustomElementJsonSchema } from "../../types";
import { IFilterCheckboxSchema } from "../filter-checkbox/types";
import { IFilterItemSchema } from "../filter-item/types";
export interface IFilterSchema extends ICustomElementJsonSchema<"filter"> {
    label?: string | undefined;
    toggleFilterButtonLabel?: string | undefined;
    children: Record<string, IFilterItemSchema | IFilterCheckboxSchema>;
    clearButtonDisabled?: boolean | undefined;
}
export type TClearBehavior = "clear" | "revert" | "retain";
