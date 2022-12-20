import { AlertProps, AlertType } from "@lifesg/react-design-system/alert";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface IAlertSchema
	extends Omit<IFrontendEngineBaseFieldJsonSchema<"alert">, "label" | "validation">,
		Omit<AlertProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	type: AlertType;
}
