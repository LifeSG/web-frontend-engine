import { InputMultiSelectProps } from "@lifesg/react-design-system";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface IMultiSelectOption {
	label: string;
	value: string;
}

export interface IMultiSelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"multi-select">,
		Omit<InputMultiSelectProps<IMultiSelectOption, string>, TFrontendEngineBaseFieldJsonSchemaKeys> {}
