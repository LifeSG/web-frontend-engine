import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface IRadioButtonGroupSchema
	extends IFrontendEngineBaseFieldJsonSchema<"radio">,
		Omit<RadioButtonProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	options: IOption[];
}
