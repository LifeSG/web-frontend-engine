/**
 * custom elements / fields are components that are defined by the `referenceKey` instead of `uiType` in the schema
 * these are typically components that are more opinionated and do not fit into the generic components
 */
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import type { TRenderRules } from "../../context-providers";
import type { IColumns, IYupValidationRule } from "../frontend-engine";
import type { IArrayFieldSchema } from "./array-field";
import type { IFilterSchema } from "./filter/filter/types";
import type { IIframeSchema } from "./iframe";
import type { TReviewEvents, TReviewSchema } from "./review";
import { ITimelineSchema } from "./timeline";

/**
 * custom element types
 * - components that do not have uiType and have specific schema to render
 */
export enum ECustomElementType {
	FILTER = "Filter",
	"FILTER-ITEM" = "FilterItem",
	TIMELINE = "Timeline",
	REVIEW = "Review",
}

/**
 * custom fields types
 */
export enum ECustomFieldType {
	"ARRAY-FIELD" = "ArrayField",
	"FILTER-CHECKBOX" = "FilterCheckbox",
	IFRAME = "Iframe",
}

/**
 * union type to represent all custom elements / fields schema
 */
export type TCustomSchema<V = undefined, C = undefined> =
	| IArrayFieldSchema<V>
	| ICustomElementJsonSchema<string>
	| IFilterSchema<V, C>
	| IIframeSchema
	| ITimelineSchema<V, C>
	| TReviewSchema
	| C;

/**
 * intersection type to represent all field events
 */
export type TCustomEvents = TReviewEvents;

/**
 * base schema for custom elements
 */
export interface ICustomElementJsonSchema<T> {
	referenceKey: T;
	uiType?: never | undefined;
	/** set responsive columns */
	columns?: IColumns | undefined;
}

/**
 * base schema for custom fields
 */
export interface IBaseCustomFieldSchema<T, V = undefined, U = undefined> extends ICustomElementJsonSchema<T> {
	validation?: (V | U | IYupValidationRule)[];
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	/** set responsive columns */
	columns?: IColumns | undefined;
}

// =============================================================================
// CUSTOM ELEMENT / FIELD PROPS
// =============================================================================
/**
 * common props for all custom elements / fields
 */
export interface IGenericCustomElementProps<T> {
	id: string;
	schema: T;
}

/**
 * common props for all custom fields
 */
export interface IGenericCustomFieldProps<T> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	id: string;
	schema: T;
	warning?: string | undefined;
}

// =============================================================================
// CUSTOM COMPONENTS
// =============================================================================
// these typings are meant for external devs to use when coming up with custom components outside Frontend Engine
// they are not meant to be used internally

/**
 * base custom component schema to extend from
 *
 * - T = string to be used in referenceKey
 * - V = custom validation definition
 */
export type TCustomComponentSchema<T, V = undefined> = IBaseCustomFieldSchema<T, V>;
/**
 * standard custom component props
 *
 * S = custom component schema
 */
export type TCustomComponentProps<S> = IGenericCustomFieldProps<S>;
