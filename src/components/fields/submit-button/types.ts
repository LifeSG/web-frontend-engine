import { ButtonProps } from "@lifesg/react-design-system/button/types";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface ISubmitButtonSchema
	extends IFrontendEngineFieldJsonSchema<"submit">,
		TComponentNativeProps<ButtonProps> {}
