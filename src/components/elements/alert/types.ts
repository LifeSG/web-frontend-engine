import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TElementSchema } from "../types";

export interface IAlertSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"alert">,
		TComponentOmitProps<AlertProps> {
	type: AlertType;
	children: React.ReactNode | Record<string, TElementSchema<V, C>>; // use element schema instead
}
