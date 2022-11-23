import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface IRadioButtonGroupSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IOption[];
}
