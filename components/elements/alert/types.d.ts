/// <reference types="react" />
import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
export interface IAlertSchema extends IBaseElementSchema<"alert">, TComponentOmitProps<AlertProps> {
    type: AlertType;
    children: React.ReactNode;
}
