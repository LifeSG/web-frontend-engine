import { TRenderRules } from "../../../context-providers";
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { IColumns, TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IListItemSchema } from "../list";

export type TWrapperType = "div" | "span" | "header" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface IWrapperSchema<V = undefined, C = undefined>
	extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
	uiType: TWrapperType;
	showIf?: TRenderRules[] | undefined;
	children: Record<string, TFrontendEngineFieldSchema<V, C>> | string;
	/** set responsive columns */
	columns?: IColumns | undefined;
}

export interface IWrapperProps {
	id?: string | undefined;
	schema?: IWrapperSchema | undefined;
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
