import { InputMultiSelectProps } from "@lifesg/react-design-system/input-multi-select";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IMultiSelectOption {
    label: string;
    value: string;
}
export interface IMultiSelectSchema<V = undefined> extends IBaseFieldSchema<"multi-select", V>, TComponentOmitProps<InputMultiSelectProps<IMultiSelectOption, string>> {
}
