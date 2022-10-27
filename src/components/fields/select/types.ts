import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ISelectOption {
	label: string;
	value: string;
}

export interface ISelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"select">,
		Omit<InputSelectProps<unknown, unknown>, TFrontendEngineBaseFieldJsonSchemaKeys> {}
