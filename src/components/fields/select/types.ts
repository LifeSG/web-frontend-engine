import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface ISelectOption {
	label: string;
	value: string;
}

export interface ISelectSchema
	extends IFrontendEngineFieldJsonSchema<"select">,
		TComponentNativeProps<InputSelectProps<ISelectOption, string>> {}
