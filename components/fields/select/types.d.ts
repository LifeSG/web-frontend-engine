import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface ISelectOption {
    label: string;
    value: string;
}
export interface ISelectSchema<V = undefined> extends IBaseFieldSchema<"select", V>, TComponentOmitProps<InputSelectProps<ISelectOption, string>> {
}
