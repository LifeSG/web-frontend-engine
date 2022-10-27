import { InputMultiSelectProps } from "@lifesg/react-design-system";
import { BaseFormElementProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface IMultiSelectOption {
	label: string;
	value: string;
}

export interface IMultiSelectRef extends BaseFormElementProps, InputMultiSelectProps<unknown, unknown> {}

export interface IMultiSelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"multi-select">,
		Omit<InputMultiSelectProps<IMultiSelectOption, IMultiSelectOption>, TFrontendEngineBaseFieldJsonSchemaKeys> {}
