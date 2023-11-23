import { InputNestedMultiSelectProps } from "@lifesg/react-design-system/input-nested-multi-select";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface IBaseOption {
	value: string;
	label: string;
}
export interface IL2Option extends IBaseOption {
	subItems?: IBaseOption[] | undefined;
}
export interface IL1Option extends IBaseOption {
	subItems?: IL2Option[] | undefined;
}

export type NestedMultiSelectProps = Pick<
	InputNestedMultiSelectProps<string, string, string>,
	| "enableSearch"
	| "disabled"
	| "hideNoResultsDisplay"
	| "listStyleWidth"
	| "mode"
	| "optionTruncationType"
	| "placeholder"
	| "readOnly"
	| "searchPlaceholder"
	| "data-testid"
>;
export interface INestedMultiSelectSchema<V = undefined>
	extends IBaseFieldSchema<"nested-multi-select", V>,
		React.HTMLAttributes<HTMLElement>,
		TComponentOmitProps<NestedMultiSelectProps> {
	options: IL1Option[];
}
