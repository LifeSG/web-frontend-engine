import { OrderedListProps, UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";
export interface IUnorderedListSchema<V = undefined, C = undefined> extends IBaseElementSchema<"unordered-list">, TComponentOmitProps<UnorderedListProps, "children"> {
    children: (string | Record<string, IListItemSchema<V, C>>)[];
}
export interface IOrderedListSchema<V = undefined, C = undefined> extends IBaseElementSchema<"ordered-list">, TComponentOmitProps<OrderedListProps, "children"> {
    children: (string | Record<string, IListItemSchema<V, C>>)[];
}
export interface IListItemSchema<V = undefined, C = undefined> extends IBaseElementSchema<"list-item">, TComponentOmitProps<TWrapperSchema> {
    children: string | Record<string, TFrontendEngineFieldSchema<V, C>>;
}
