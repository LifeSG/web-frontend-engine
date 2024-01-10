import { InputNestedMultiSelectProps } from "@lifesg/react-design-system/input-nested-multi-select";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface IBaseOptionProps {
	label: string;
	key: string;
}
interface IBaseOptionPropsWithValues extends IBaseOptionProps {
	value: string;
	subItems?: never;
}

interface IBaseOptionPropsWithSubItems<T> extends IBaseOptionProps {
	value?: never;
	subItems: T;
}
export interface IL1Value {
	[key: string]: IL2Value | string;
}
export interface IL2Value {
	[key: string]: IL3Value | string;
}
export interface IL3Value {
	[key: string]: string;
}

export type TL1OptionProps = IBaseOptionPropsWithValues | IBaseOptionPropsWithSubItems<TL2OptionProps[]>;
export type TL2OptionProps = IBaseOptionPropsWithValues | IBaseOptionPropsWithSubItems<TL3OptionProps[]>;
export type TL3OptionProps = IBaseOptionPropsWithValues;

export type TNestedValues = IL1Value | IL2Value | IL3Value;

export type TNestedMultiSelectProps = Pick<
	InputNestedMultiSelectProps<string, string, string>,
	| "disabled"
	| "enableSearch"
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
		TComponentOmitProps<TNestedMultiSelectProps> {
	options: TL1OptionProps[];
}
