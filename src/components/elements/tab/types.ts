import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface ITabSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"tab">,
		TComponentOmitProps<IWrapperSchema> {
	children: Record<string, ITabItemSchema<V, C>>;
	currentActiveTabId?: string | undefined;
}

export interface ITabItemSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"tab-item">,
		TComponentOmitProps<IWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	title: string;
}
