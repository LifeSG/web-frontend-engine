/// <reference types="react" />
import { InputNestedMultiSelectProps } from "@lifesg/react-design-system/input-nested-multi-select";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
import { L1OptionProps, L2OptionProps, L3OptionProps } from "@lifesg/react-design-system";
export type TL1OptionProps = L1OptionProps<string, string, string>;
export type TL2OptionProps = L2OptionProps<string, string>;
export type TL3OptionProps = L3OptionProps<string>;
export type TNestedValues = IL1Value | IL2Value | IL3Value;
export interface IL1Value {
    [key: string]: IL2Value | string;
}
export interface IL2Value {
    [key: string]: IL3Value | string;
}
export interface IL3Value {
    [key: string]: string;
}
export type NestedMultiSelectProps = Pick<InputNestedMultiSelectProps<string, string, string>, "disabled" | "enableSearch" | "hideNoResultsDisplay" | "listStyleWidth" | "mode" | "optionTruncationType" | "placeholder" | "readOnly" | "searchPlaceholder" | "data-testid">;
export interface INestedMultiSelectSchema<V = undefined> extends IBaseFieldSchema<"nested-multi-select", V>, React.HTMLAttributes<HTMLElement>, TComponentOmitProps<NestedMultiSelectProps> {
    options: TL1OptionProps[];
}
