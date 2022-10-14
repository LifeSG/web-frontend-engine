import { ButtonProps } from "@lifesg/react-design-system";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";

export interface ISubmitButtonSchema extends IFrontendEngineBaseFieldJsonSchema, Pick<ButtonProps, "styleType"> {
	type: "SUBMIT";
}
