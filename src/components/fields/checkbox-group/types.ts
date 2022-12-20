import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface ICheckboxGroupSchema
	extends IFrontendEngineFieldJsonSchema<"checkbox">,
		TComponentNativeProps<CheckboxProps> {
	options: IOption[];
}
