import { InputMultiSelectProps } from "@lifesg/react-design-system";
import { BaseFormElementProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface IMultiSelectRef extends BaseFormElementProps, InputMultiSelectProps<unknown, unknown> {}

export interface IMultiSelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"MULTISELECT">,
		Omit<InputMultiSelectProps<unknown, unknown>, TFrontendEngineBaseFieldJsonSchemaKeys> {}

export interface IOption {
	label: string;
	value: string | number;
}
