import { OrderedListProps, UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { TypographySizeType } from "@lifesg/react-design-system/theme/font/types";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";

export interface IUnorderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"unordered-list">,
		TComponentOmitProps<UnorderedListProps, "children" | "size"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
	size?: TypographySizeType | undefined;
}

export interface IOrderedListSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"ordered-list">,
		TComponentOmitProps<OrderedListProps, "children" | "size"> {
	children: (string | Record<string, IListItemSchema<V, C>>)[];
	size?: TypographySizeType | undefined;
}

export interface IListItemSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"list-item">,
		TComponentOmitProps<TWrapperSchema> {
	children: string | Record<string, TFrontendEngineFieldSchema<V, C>>;
}
