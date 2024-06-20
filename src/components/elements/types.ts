import { TRenderRules } from "../../context-providers";
import { IColumns } from "../frontend-engine";
import type { IAlertSchema } from "./alert";
import { IDividerSchema } from "./divider";
import { IGridSchema } from "./grid";
import { IOrderedListSchema, IUnorderedListSchema } from "./list";
import { ITabItemSchema, ITabSchema } from "./tab";
import type { ITextSchema } from "./text";
import type { IWrapperSchema } from "./wrapper";

/**
 * element types
 * - components that do not have values
 * - typically used for layouts and messages
 */
export enum EElementType {
	ALERT = "Alert",
	"TEXT-D1" = "Text",
	"TEXT-D2" = "Text",
	"TEXT-DBODY" = "Text",
	"TEXT-H1" = "Text",
	"TEXT-H2" = "Text",
	"TEXT-H3" = "Text",
	"TEXT-H4" = "Text",
	"TEXT-H5" = "Text",
	"TEXT-H6" = "Text",
	"TEXT-BODY" = "Text",
	"TEXT-BODYSMALL" = "Text",
	"TEXT-XSMALL" = "Text",
	DIV = "Wrapper",
	DIVIDER = "Divider",
	SPAN = "Wrapper",
	HEADER = "Wrapper",
	FOOTER = "Wrapper",
	H1 = "Wrapper",
	H2 = "Wrapper",
	H3 = "Wrapper",
	H4 = "Wrapper",
	H5 = "Wrapper",
	H6 = "Wrapper",
	P = "Wrapper",
	GRID = "Grid",
	TAB = "Tab",
	"TAB-ITEM" = "TabItem",
	"LIST-ITEM" = "ListItem",
	"ORDERED-LIST" = "List",
	"UNORDERED-LIST" = "List",
	ACCORDION = "Accordion",
}

/**
 * union type to represent all element schemas
 */
export type TElementSchema<V = undefined> =
	| IAlertSchema
	| IDividerSchema
	| IGridSchema<V>
	| IOrderedListSchema<V>
	| ITabItemSchema<V>
	| ITabSchema<V>
	| ITextSchema
	| IUnorderedListSchema<V>
	| IWrapperSchema<V>;

/**
 * common element schema for element schemas to extend from
 */
export interface IBaseElementSchema<T> {
	/** defines what kind of component to be rendered */
	uiType: T;
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	/** escape hatch for other form / frontend engines to have unsupported attributes */
	customOptions?: Record<string, unknown> | undefined;
	/** set responsive columns */
	columns?: IColumns | undefined;
}
// =============================================================================
// ELEMENT PROPS
// =============================================================================
/**
 * common props for all elements
 */
export interface IGenericElementProps<T> {
	id: string;
	schema: T;
}
