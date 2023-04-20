import { ICustomComponentJsonSchema } from "../../frontend-engine";
import { IFilterItemCheckboxSchema } from "./filter-item-checkbox/types";
import { IFilterItemSchema } from "./filter-item/types";

export interface IFilterSchema extends ICustomComponentJsonSchema {
	label?: string | undefined;
	toggleFilterButtonLabel?: string | undefined;
	children: Record<string, IFilterItemSchema | IFilterItemCheckboxSchema>;
}

export interface IFilterProps {
	id?: string | undefined;
	schema?: IFilterSchema | undefined;
	warnings?: Record<string, string> | undefined;
}
