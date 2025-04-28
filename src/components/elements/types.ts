import { TRenderRules } from "../../context-providers";
import { IColumns, IV3Columns } from "../frontend-engine";
import { IAccordionSchema, TAccordionEvents } from "./accordion";
import type { IAlertSchema } from "./alert";
import { IDividerSchema } from "./divider";
import { IGridSchema } from "./grid";
import { IOrderedListSchema, IUnorderedListSchema } from "./list";
import { IPopoverSchema } from "./popover";
import { ITabItemSchema, ITabSchema } from "./tab";
import type { ITextSchema, ITypographySchema } from "./text";
import type { IInlineWrapperSchema, TWrapperSchema } from "./wrapper";

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
	POPOVER = "Popover",
}

/**
 * union type to represent all element schemas
 */
export type TElementSchema<V = undefined, C = undefined> =
	| TContainerElementSchema<V, C>
	| TBlockElementSchema<V, C>
	| TInlineElementSchema
	| TWrapperSchema<V, C>;

/** represent element schemas that render content containers */
export type TContainerElementSchema<V = undefined, C = undefined> =
	| IAccordionSchema<V, C>
	| IGridSchema<V, C>
	| ITabItemSchema<V, C>
	| ITabSchema<V, C>;

/** represent element schemas that render block-level ui elements */
export type TBlockElementSchema<V = undefined, C = undefined> =
	| IAlertSchema
	| IDividerSchema
	| IOrderedListSchema<V, C>
	| ITextSchema
	| ITypographySchema
	| IUnorderedListSchema<V, C>;

/** represent element schemas that render inline ui elements */
export type TInlineElementSchema<V = undefined, C = undefined> = IInlineWrapperSchema<V, C> | IPopoverSchema;

/**
 * intersection type to represent all field events
 */
export type TElementEvents = TAccordionEvents;

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
	columns?: IColumns | IV3Columns | undefined;
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
