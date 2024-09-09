import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";

export interface IAlertSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"alert">,
		TComponentOmitProps<AlertProps> {
	type: AlertType;
	children: React.ReactNode | Record<string, TFrontendEngineFieldSchema<V, C>>;
}
