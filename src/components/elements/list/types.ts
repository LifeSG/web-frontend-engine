import { OrderedListProps, UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { V2_TextSizeType } from "@lifesg/react-design-system/v2_text/types";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";

export interface IUnorderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"unordered-list">,
		TComponentOmitProps<UnorderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

/**
 * @deprecated Use design system v3 IUnorderedListSchema
 */
export interface IV2UnorderedListSchema<V = undefined, C = undefined> extends Omit<IUnorderedListSchema, "size"> {
	size: V2_TextSizeType;
}

export interface IOrderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"ordered-list">,
		TComponentOmitProps<OrderedListProps, "children"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
}

/**
 * @deprecated Use design system v3 IOrderedListSchema
 */
export interface IV2OrderedListSchema<V = undefined, C = undefined> extends Omit<IOrderedListSchema, "size"> {
	size: V2_TextSizeType;
}

export interface IListItemSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"list-item">,
		TComponentOmitProps<TWrapperSchema> {
	children: string | Record<string, TFrontendEngineFieldSchema<V, C>>;
}
