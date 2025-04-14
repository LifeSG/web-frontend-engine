import { ColProps } from "@lifesg/react-design-system";
import { TRenderRules } from "../../../context-providers";
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { IColumns, TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IListItemSchema } from "../list";
import { TInlineElementSchema } from "../types";

export type TWrapperType = TBlockWrapperType | TInlineWrapperType;
export type TBlockWrapperType = "div" | "header" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
export type TInlineWrapperType = "span";

export type TWrapperSchema<V = undefined, C = undefined> = TBlockWrapperSchema<V, C> | TInlineWrapperSchema;

/** @deprecated use `TWrapperSchema` */
export type IWrapperSchema<V = undefined, C = undefined> = TBlockWrapperSchema<V, C> | TInlineWrapperSchema;

interface IBlockWrapperSchemaBase<V = undefined, C = undefined>
	extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
	uiType: TBlockWrapperType;
	showIf?: TRenderRules[] | undefined;
	children: Record<string, TFrontendEngineFieldSchema<V, C>> | string;
}

// Define the variants with discriminated union
export type TBlockWrapperSchema<V = undefined, C = undefined> =
	| (IBlockWrapperSchemaBase<V, C> & {
			colType?: "v2" | undefined;
			columns?: IColumns | undefined;
	  })
	| (IBlockWrapperSchemaBase<V, C> & {
			colType: "v3";
			columns?: ColProps | undefined;
	  });

interface IInlineWrapperSchemaBase<V = undefined, C = undefined>
	extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
	uiType: TInlineWrapperType;
	showIf?: TRenderRules[] | undefined;
	children: Record<string, TInlineElementSchema<V, C>> | string;
}

// Define the variants with discriminated union
export type TInlineWrapperSchema<V = undefined, C = undefined> =
	| (IInlineWrapperSchemaBase<V, C> & {
			colType?: "v2" | undefined;
			columns?: IColumns | undefined;
	  })
	| (IInlineWrapperSchemaBase<V, C> & {
			colType: "v3";
			columns?: ColProps | undefined;
	  });

export interface IWrapperProps {
	id?: string | undefined;
	schema?: TWrapperSchema | undefined;
	/** only used internally by FrontendEngine */
	children?:
		| Record<string, TFrontendEngineFieldSchema>
		| Record<string, IFilterItemSchema | IFilterCheckboxSchema>
		| Record<string, IListItemSchema>
		| undefined;
}

export type TWrapperChildSchema =
	| TFrontendEngineFieldSchema
	| IFilterItemSchema
	| IFilterCheckboxSchema
	| IListItemSchema;
