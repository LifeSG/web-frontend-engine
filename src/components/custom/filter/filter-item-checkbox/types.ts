import { ICustomFieldJsonSchema } from "../../../frontend-engine";
export interface IFilterItemCheckboxSchema<V = undefined> extends ICustomFieldJsonSchema<"filter-item-checkbox", V> {
	label: string;
	options: IOption[];
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
}

export interface IOption {
	label: string;
	value: string;
}
