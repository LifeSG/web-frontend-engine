import { ButtonProps } from "@lifesg/react-design-system";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ISubmitButtonSchema
	extends IFrontendEngineBaseFieldJsonSchema,
		Omit<ButtonProps, TFrontendEngineBaseFieldJsonSchemaKeys | "type"> {
	type: "SUBMIT";
}
