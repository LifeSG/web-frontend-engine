import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface ICheckboxGroupSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IOption[];
}
