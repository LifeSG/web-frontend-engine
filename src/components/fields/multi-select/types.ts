import { InputMultiSelectProps } from "@lifesg/react-design-system";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface IMultiSelectOption {
	label: string;
	value: string;
}

export interface IMultiSelectSchema
	extends IFrontendEngineFieldJsonSchema<"multi-select">,
		TComponentNativeProps<InputMultiSelectProps<IMultiSelectOption, string>> {}
