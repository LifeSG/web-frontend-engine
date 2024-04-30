import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface ITabSchema<V = undefined> extends IBaseElementSchema<"tab">, TComponentOmitProps<IWrapperSchema> {
	children: Record<string, ITabItemSchema<V>>;
	currentActiveTabId?: string | undefined;
}

export interface ITabItemSchema<V = undefined>
	extends IBaseElementSchema<"tab-item">,
		TComponentOmitProps<IWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema<V>>;
	title: string;
}
