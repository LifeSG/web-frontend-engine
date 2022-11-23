import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { IFrontendEngineElementJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface IAlertSchema extends IFrontendEngineElementJsonSchema<"alert">, TComponentOmitProps<AlertProps> {
	type: AlertType;
}
