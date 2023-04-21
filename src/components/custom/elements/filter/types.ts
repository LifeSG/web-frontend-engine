import { ICustomComponentJsonSchema } from "../../../frontend-engine";
import { IFilterItemCheckboxSchema } from "../../fields/filter-item-checkbox/types";
import { IFilterItemSchema } from "../../elements/filter-item/types";

export interface IFilterSchema<V = undefined> extends ICustomComponentJsonSchema<"filter", V> {
	label?: string | undefined;
	toggleFilterButtonLabel?: string | undefined;
	children: Record<string, IFilterItemSchema | IFilterItemCheckboxSchema>;
}

export interface IFilterProps {
	id?: string | undefined;
	schema?: IFilterSchema | undefined;
	warnings?: Record<string, string> | undefined;
}
