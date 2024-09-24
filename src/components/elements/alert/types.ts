import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TBlockElementSchema, TInlineElementSchema } from "../types";

export interface IAlertSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"alert">,
		TComponentOmitProps<AlertProps> {
	type: AlertType;
	children: React.ReactNode | Record<string, TBlockElementSchema<V, C> | TInlineElementSchema>;
}
