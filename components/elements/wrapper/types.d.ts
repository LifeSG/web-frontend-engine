/// <reference types="react" />
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { IColumns, TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { TRenderRules } from "../../../context-providers";
export type TWrapperType = "div" | "span" | "header" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
export interface IWrapperSchema extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
    uiType: TWrapperType;
    showIf?: TRenderRules[] | undefined;
    children: Record<string, TFrontendEngineFieldSchema> | string;
    /** set responsive columns */
    columns?: IColumns | undefined;
}
export interface IWrapperProps {
    id?: string | undefined;
    schema?: IWrapperSchema | undefined;
    /** only used internally by FrontendEngine */
    children?: Record<string, TFrontendEngineFieldSchema> | Record<string, IFilterItemSchema | IFilterCheckboxSchema> | undefined;
}
