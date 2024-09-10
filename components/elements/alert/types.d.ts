/// <reference types="react" />
import { AlertProps, AlertType } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import type { IDividerSchema } from "../divider";
import type { IOrderedListSchema, IUnorderedListSchema } from "../list";
import type { ITextSchema } from "../text";
import { IBaseElementSchema } from "../types";
export interface IAlertSchema<V = undefined, C = undefined> extends IBaseElementSchema<"alert">, TComponentOmitProps<AlertProps> {
    type: AlertType;
    children: React.ReactNode | Record<string, IDividerSchema | IOrderedListSchema<V, C> | ITextSchema | IUnorderedListSchema<V, C>>;
}
