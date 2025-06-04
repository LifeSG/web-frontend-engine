import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";
export interface ITabSchema<V = undefined, C = undefined> extends IBaseElementSchema<"tab">, TComponentOmitProps<TWrapperSchema> {
    children: Record<string, ITabItemSchema<V, C>>;
    currentActiveTabId?: string | undefined;
}
export interface ITabItemSchema<V = undefined, C = undefined> extends IBaseElementSchema<"tab-item">, TComponentOmitProps<TWrapperSchema> {
    children: Record<string, TFrontendEngineFieldSchema<V, C>>;
    title: string;
}
