import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface ITabSchema extends IBaseElementSchema<"tab">, TComponentOmitProps<IWrapperSchema> {
	children: Record<string, ITabItemSchema>;
	currentActiveTabId?: string | undefined;
}

export interface ITabItemSchema extends IBaseElementSchema<"tab-item">, TComponentOmitProps<IWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema>;
	title: string;
}
