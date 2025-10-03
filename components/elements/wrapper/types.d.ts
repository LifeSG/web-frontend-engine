/// <reference types="react" />
import { TRenderRules } from "../../../context-providers";
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { IColumns, TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IListItemSchema } from "../list";
import { TInlineElementSchema } from "../types";
export type TWrapperType = TBlockWrapperType | TInlineWrapperType;
export type TBlockWrapperType = "div" | "header" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
export type TInlineWrapperType = "span";
export type TWrapperSchema<V = undefined, C = undefined> = IBlockWrapperSchema<V, C> | IInlineWrapperSchema;
/** @deprecated use `TWrapperSchema` */
export type IWrapperSchema<V = undefined, C = undefined> = IBlockWrapperSchema<V, C> | IInlineWrapperSchema;
export interface IBlockWrapperSchema<V = undefined, C = undefined> extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
    uiType: TBlockWrapperType;
    showIf?: TRenderRules[] | undefined;
    children: Record<string, TFrontendEngineFieldSchema<V, C>> | string;
    /** set responsive columns */
    columns?: IColumns | undefined;
}
export interface IInlineWrapperSchema<V = undefined, C = undefined> extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
    uiType: TInlineWrapperType;
    showIf?: TRenderRules[] | undefined;
    children: Record<string, TInlineElementSchema<V, C>> | string;
    /** set responsive columns */
    columns?: IColumns | undefined;
}
export interface IWrapperProps {
    id?: string | undefined;
    schema?: TWrapperSchema | undefined;
    /** only used internally by FrontendEngine */
    children?: Record<string, TFrontendEngineFieldSchema> | Record<string, IFilterItemSchema | IFilterCheckboxSchema> | Record<string, IListItemSchema> | undefined;
}
export type TWrapperChildSchema = TFrontendEngineFieldSchema | IFilterItemSchema | IFilterCheckboxSchema | IListItemSchema;
