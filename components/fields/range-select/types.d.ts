import { InputRangeSelectProps } from "@lifesg/react-design-system/input-range-select/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IRangeSelectOption {
    label: string;
    value: string;
}
export interface IRangeSelectSchema<V = undefined> extends IBaseFieldSchema<"range-select", V>, TComponentOmitProps<InputRangeSelectProps<IRangeSelectOption, string>> {
}
