import { ButtonProps } from "@lifesg/react-design-system/button/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface ISubmitButtonSchema extends Omit<IFrontendEngineBaseFieldJsonSchema<"submit">, "validation">, TComponentOmitProps<ButtonProps> {
}
