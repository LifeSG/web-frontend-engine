import { ICustomComponentJsonSchema } from "../../../frontend-engine";
import { IFilterCheckboxSchema } from "../filter-checkbox/types";
import { IFilterItemSchema } from "../filter-item/types";

export interface IFilterSchema extends ICustomComponentJsonSchema<"filter"> {
	label?: string | undefined;
	toggleFilterButtonLabel?: string | undefined;
	children: Record<string, IFilterItemSchema | IFilterCheckboxSchema>;
	clearButtonDisabled?: boolean | undefined;
}

export interface IFilterProps {
	id: string | undefined;
	schema: IFilterSchema | undefined;
	warnings?: Record<string, string> | undefined;
}
