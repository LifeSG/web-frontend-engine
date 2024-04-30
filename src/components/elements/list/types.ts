import { OrderedListProps, UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface IUnorderedListSchema<V = undefined>
	extends IBaseElementSchema<"unordered-list">,
		TComponentOmitProps<UnorderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V>>)[];
}

export interface IOrderedListSchema<V = undefined>
	extends IBaseElementSchema<"ordered-list">,
		TComponentOmitProps<OrderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V>>)[];
}

export interface IListItemSchema<V = undefined>
	extends IBaseElementSchema<"list-item">,
		TComponentOmitProps<IWrapperSchema> {
	children: string | Record<string, TFrontendEngineFieldSchema<V>>;
}
