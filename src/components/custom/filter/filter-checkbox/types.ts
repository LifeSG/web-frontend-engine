import { IBaseCustomFieldSchema } from "../../types";
import { TClearBehavior } from "../filter/types";
import { IFilterItemLabel } from "../types";

export interface IFilterCheckboxSchema<V = undefined>
	extends Omit<IBaseCustomFieldSchema<"filter-checkbox", V>, "validation"> {
	label: string | IFilterItemLabel;
	options: IOption[];
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
	clearBehavior?: TClearBehavior | undefined;
	expanded?: boolean | undefined;
}

export interface IOption {
	label: string;
	value: string;
}
