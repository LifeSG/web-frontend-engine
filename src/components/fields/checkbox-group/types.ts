import { CheckboxProps } from "@lifesg/react-design-system";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface IOption {
	label: string;
	value: string;
}

export interface ICheckboxGroupSchema
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox">,
		Omit<CheckboxProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	options: IOption[];
}

export interface ICheckboxOption extends IOption {
	checked?: boolean;
}
