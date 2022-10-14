import { InputSelectProps } from "@lifesg/react-design-system";
import { BaseFormElementProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ISelectRef extends BaseFormElementProps, InputSelectProps<string, string> {}

export interface ISelectSchema
	extends IFrontendEngineBaseFieldJsonSchema,
		Omit<InputSelectProps<unknown, unknown>, TFrontendEngineBaseFieldJsonSchemaKeys> {
	type: "SELECT";
}
