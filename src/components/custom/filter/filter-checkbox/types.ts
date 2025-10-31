import { IBaseCustomFieldSchema } from "../../types";
import { TClearBehavior } from "../filter/types";
import { IFilterItemLabel } from "../types";

export interface IFilterCheckboxSchema<V = undefined> extends IBaseCustomFieldSchema<"filter-checkbox", V> {
	label: string | IFilterItemLabel;
	options: IOption[];
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
	clearBehavior?: TClearBehavior | undefined;
	expanded?: boolean | undefined;
	useToggleContentWidth?: boolean | undefined;
}

export interface IParentOption {
	label: string;
	key: string;
	options: IOption[];
}

export interface ILeafOption {
	label: string;
	value: string;
}

export type IOption = IParentOption | ILeafOption;
