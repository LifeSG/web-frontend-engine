import { InputSelectProps } from "@lifesg/react-design-system";
import { BaseFormElementProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ISelectRef extends BaseFormElementProps, InputSelectProps<unknown, unknown> {}

export interface ISelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"SELECT">,
		Omit<InputSelectProps<unknown, unknown>, TFrontendEngineBaseFieldJsonSchemaKeys> {}
