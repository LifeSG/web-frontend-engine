import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface IRadioButtonGroupSchema
	extends IFrontendEngineFieldJsonSchema<"radio">,
		TComponentNativeProps<RadioButtonProps> {
	options: IOption[];
}
