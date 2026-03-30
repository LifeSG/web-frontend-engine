/// <reference types="react" />
import { AlertProps, AlertType } from "@lifesg/react-design-system/alert";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TBlockElementSchema, TInlineElementSchema } from "../types";
type TAlertChildren<V, C> = Exclude<TBlockElementSchema<V, C>, IAlertSchema> | TInlineElementSchema;
export interface IAlertSchema<V = undefined, C = undefined> extends IBaseElementSchema<"alert">, TComponentOmitProps<AlertProps> {
    type: AlertType;
    children: React.ReactNode | Record<string, TAlertChildren<V, C>>;
}
export {};
