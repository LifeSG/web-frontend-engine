import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface ISelectOption {
    label: string;
    value: string;
}
export interface ISelectSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"select", V>, TComponentOmitProps<InputSelectProps<ISelectOption, string>> {
}
