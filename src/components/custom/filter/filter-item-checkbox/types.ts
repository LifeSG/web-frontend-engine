import {
	ICustomFieldJsonSchema,
	IFrontendEngineBaseFieldJsonSchema,
	TComponentOmitProps,
} from "../../../frontend-engine";
import { FilterItemCheckboxProps } from "@lifesg/react-design-system/filter/types";
export interface IFilterItemCheckboxSchema<V = undefined> extends ICustomFieldJsonSchema<"filter-item-checkbox", V> {
	label: string;
	options: IOption[];
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
}

export interface IFilterItemCheckboxProps<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox", V>,
		TComponentOmitProps<FilterItemCheckboxProps<IOption>> {
	options: IOption[];
}

export interface IOption {
	label: string;
	value: string;
}
