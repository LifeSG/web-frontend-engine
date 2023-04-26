import { ICustomComponentJsonSchema } from "../../../frontend-engine";
import { IFilterItemCheckboxSchema } from "../filter-item-checkbox/types";
import { IFilterItemSchema } from "../filter-item/types";

export interface IFilterSchema extends ICustomComponentJsonSchema<"filter"> {
	label?: string | undefined;
	toggleFilterButtonLabel?: string | undefined;
	children: Record<string, IFilterItemSchema | IFilterItemCheckboxSchema>;
	onClear?: () => void | undefined;
	clearButtonDisabled?: boolean | undefined;
}

export interface IFilterProps {
	id: string | undefined;
	schema: IFilterSchema | undefined;
	warnings?: Record<string, string> | undefined;
}
