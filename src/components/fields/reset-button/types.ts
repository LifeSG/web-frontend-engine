import { ButtonProps } from "@lifesg/react-design-system/button/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface IResetButtonSchema
	extends Omit<IFrontendEngineBaseFieldJsonSchema<"reset">, "validation">,
		TComponentOmitProps<ButtonProps, "disabled"> {
	disabled?: boolean | undefined;
}
