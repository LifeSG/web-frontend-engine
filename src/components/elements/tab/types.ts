import { TabItemProps, TabProps } from "@lifesg/react-design-system/tab";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";
import { TFieldEventListener } from "../../../utils";

type TTabProps = Pick<TabProps, "fullWidthIndicatorLine">;

export interface ITabSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"tab">,
		TComponentOmitProps<TWrapperSchema>,
		TTabProps {
	children: Record<string, ITabItemSchema<V, C>>;
	currentActiveTabId?: string | undefined;
}

type TTabItemProps = Pick<TabItemProps, "width">;

export interface ITabItemSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"tab-item">,
		TComponentOmitProps<TWrapperSchema>,
		TTabItemProps {
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	title: string;
}

// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired when active tab changes (semantic event: "change", not raw "click") */
function tabChangeEvent(
	uiType: "tab",
	type: "change",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function tabChangeEvent() {
	//
}
export type TTabEvents = typeof tabChangeEvent;
