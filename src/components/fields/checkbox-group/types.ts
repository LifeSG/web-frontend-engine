import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

export interface ICheckboxGroupSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IOption[];
}
