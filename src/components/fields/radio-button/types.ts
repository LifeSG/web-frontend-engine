import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

export interface IRadioButtonGroupSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IOption[];
}
