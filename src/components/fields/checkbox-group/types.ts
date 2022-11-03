import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
}

export interface ICheckboxGroupSchema
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox">,
		Omit<CheckboxProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	options: IOption[];
}
