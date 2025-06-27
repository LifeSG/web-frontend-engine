import { TabItemProps, TabProps } from "@lifesg/react-design-system/tab";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";

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
