import { IBaseCustomFieldSchema } from "../../types";
import { TClearBehavior } from "../filter/types";

export interface IFilterCheckboxSchema<V = undefined>
	extends Omit<IBaseCustomFieldSchema<"filter-checkbox", V>, "validation"> {
	label: string;
	options: IOption[];
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
	clearBehavior?: TClearBehavior | undefined;
	initialExpanded?: boolean | undefined;
}

export interface IOption {
	label: string;
	value: string;
}
