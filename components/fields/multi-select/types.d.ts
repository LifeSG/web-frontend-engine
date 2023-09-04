import { InputMultiSelectProps } from "@lifesg/react-design-system/input-multi-select";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface IMultiSelectOption {
    label: string;
    value: string;
}
export interface IMultiSelectSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"multi-select", V>, TComponentOmitProps<InputMultiSelectProps<IMultiSelectOption, string>> {
}
