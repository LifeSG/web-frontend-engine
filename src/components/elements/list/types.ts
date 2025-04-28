import { V2_OrderedListProps, V2_UnorderedListProps } from "@lifesg/react-design-system/v2_text-list";
import { OrderedListProps, UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";

/**
 * @deprecated Use design system v3 IUnorderedListSchema
 */
export interface IV2UnorderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"unordered-list">,
		TComponentOmitProps<V2_UnorderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

export interface IUnorderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"unordered-list">,
		TComponentOmitProps<UnorderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

/**
 * @deprecated Use design system v3 IOrderedListSchema
 */

export interface IV2OrderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"ordered-list">,
		TComponentOmitProps<V2_OrderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

export interface IOrderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"ordered-list">,
		TComponentOmitProps<OrderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

export interface IListItemSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"list-item">,
		TComponentOmitProps<TWrapperSchema> {
	children: string | Record<string, TFrontendEngineFieldSchema<V, C>>;
}
