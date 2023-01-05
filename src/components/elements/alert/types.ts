import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { IFrontendEngineElementJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface IAlertSchema extends IFrontendEngineElementJsonSchema<"alert">, TComponentNativeProps<AlertProps> {
	type: AlertType;
}
