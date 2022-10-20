import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ISelectSchema
	extends IFrontendEngineBaseFieldJsonSchema<"SELECT">,
		Omit<InputSelectProps<unknown, unknown>, TFrontendEngineBaseFieldJsonSchemaKeys> {}
