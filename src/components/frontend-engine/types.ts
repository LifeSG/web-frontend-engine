import { UseFormClearErrors, UseFormReset, UseFormSetValue, ValidationMode } from "react-hook-form";
import {
	TAddFieldEventListener,
	TCustomComponents,
	TCustomValidationFunction,
	TDispatchFieldEvent,
	TRemoveFieldEventListener,
	TYupSchemaType,
} from "../../context-providers";
import { RecursivePartial } from "../../utils";
import { TCustomSchema } from "../custom";
import { TElementSchema } from "../elements";
import { ISectionSchema } from "../elements/section";
import { TFieldSchema } from "../fields";
import { ColProps } from "@lifesg/react-design-system/layout";

export type { IYupValidationRule, TCustomComponents, TCustomValidationFunction } from "../../context-providers";

// =============================================================================
// FRONTEND ENGINE
// =============================================================================
export interface IFrontendEngineProps<V = undefined, C = undefined> {
	/** HTML class attribute that is applied on the `<form>` element */
	className?: string | undefined;
	/** Custom components defined outside Frontend Engine. Key denotes referenceKey in schema while value is the component to be used */
	components?: TCustomComponents | undefined;
	/**
	 * JSON configuration to define the components and functionalities of the form
	 *
	 * Generics
	 * - V = custom validation types
	 * - C = custom component types
	 *  */
	data?: IFrontendEngineData<V, C> | undefined;
	/** Fires on mount and every time the schema or value changes */
	onChange?: ((values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown) | undefined;
	/** Submit event handler, will receive the form data if form validation is successful */
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
	/** Submit error event handler, invoked when form fails validation on submissiohn. Will receive validation errors */
	onSubmitError?: (errors: TFrontendEngineValues) => unknown | undefined;
	/** Fires every time a value changes in any fields */
	onValueChange?: ((values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown) | undefined;
	/** Indicates whether to wrap Frontend Engine fields within the `<form>` element, by default, fields will be rendered within the `<form>` element
	 *
	 * When false, the fields will be rendered within the `<div>` element instead
	 *
	 * This is for instances where Frontend Engine needs to be rendered within another <form> element
	 *
	 * Default: true */
	wrapInForm?: boolean | undefined;
}

/**
 * JSON configuration to define the components and functionalities of the form
 *
 * Generics
 * - V = custom validation types
 * - C = custom component types
 */
export interface IFrontendEngineData<V = undefined, C = undefined> {
	/** HTML class attribute */
	className?: string | undefined;
	/** Fields' initial values on mount. The key of each field needs to match the id used in the field */
	defaultValues?: TFrontendEngineValues | undefined;
	/**
	 * Specifies the components to be rendered
	 *
	 * All components within the form are in key-value format, key refers to the id of the components while value refers to its JSON schema
	 *
	 * Note: sections accept only section `uiType`, the subsequent children accepts uiType other than section
	 * */
	sections: Record<string, ISectionSchema<V, C>>;
	/** Unique HTML id attribute that is applied on the `<form>` element */
	id?: string | undefined;
	/** Validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event) */
	revalidationMode?: TRevalidationMode | undefined;
	/** Validation strategy before a user submits the form (onSubmit event) */
	validationMode?: TValidationMode | undefined;
	/** Additional properties to mutate the sections schema on-the-fly */
	overrides?: Record<string, RecursivePartial<TFrontendEngineFieldSchema<V>>> | undefined;
	/**
	 * Specifies how a conditionally rendered field gets populated when it is shown again
	 * - `"none"`: cleared
	 * - `"default-value"`: the initial value
	 * - `"user-input"`: the latest value
	 */
	restoreMode?: TRestoreMode | undefined;
	/**
	 * Excludes values of fields that are not declared in the schema on submit / via getValues()
	 */
	stripUnknown?: boolean | undefined;
}

export type TFrontendEngineValues<T = any> = { [P in keyof T]: T[keyof T] };
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;
export type TRestoreMode = "none" | "default-value" | "user-input";
export type TErrorMessage = string | string[] | { [key: string]: TErrorMessage };
export type TErrorPayload = Record<string, TErrorMessage>;
export type TWarningPayload = Record<string, string>;

export interface IFrontendEngineRef
	extends Omit<HTMLDivElement, "addEventListener" | "removeEventListener">,
		HTMLFormElement {
	/**
	 * adds custom validation rule
	 * @param type The schema type
	 * @param name Name of the condition
	 * @param fn Validation function, it must return a boolean
	 * @param overwrite Whether to replace if the custom validation is already exists
	 */
	addCustomValidation: (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: TCustomValidationFunction,
		overwrite?: boolean | undefined
	) => void;
	addFieldEventListener: TAddFieldEventListener;
	dispatchFieldEvent: TDispatchFieldEvent;
	/**
	 * gets form values
	 * @param payload specify the value(s) by field id(s) to return
	 * - undefined	Returns the entire form values.
	 * - string	Gets the value at path of the form values.
	 * - array	Returns an array of the value at path of the form values.
	 */
	getValues: (payload?: string | string[] | undefined) => TFrontendEngineValues;
	/**
	 * checks if form has been changed by user
	 *
	 * defaultValues do not set this to true
	 */
	isDirty: boolean;
	/** checks if form is valid */
	isValid: () => boolean;
	/**
	 * triggers validation in the form or for specific field
	 */
	validate: (name?: string | string[] | undefined) => Promise<boolean>;
	/** adds custom validation rule */
	removeFieldEventListener: TRemoveFieldEventListener;
	/** resets the form to the default state */
	reset: UseFormReset<TFrontendEngineValues>;
	/** allows setting of custom errors */
	setErrors: (errors: TErrorPayload) => void;
	/** clear form errors */
	clearErrors: UseFormClearErrors<TFrontendEngineValues>;
	/** allows setting of custom warnings */
	setWarnings: (warnings: TWarningPayload) => void;
	/** sets field value by id */
	setValue: UseFormSetValue<TFrontendEngineValues>;
	/** triggers form submission */
	submit: () => void;
}

// =============================================================================
// JSON SCHEMA
// =============================================================================
// contains all schema types except for sections schema
export type TFrontendEngineFieldSchema<V = undefined, C = undefined> =
	| TFieldSchema<V, C>
	| TCustomSchema<V, C>
	| TElementSchema<V, C>;

type MobileCol = 1 | 2 | 3 | 4;
type MobileColRange = MobileCol | 5;
type TabletCol = MobileCol | 5 | 6 | 7 | 8;
type TabletColRange = TabletCol | 9;
type DesktopCol = TabletCol | 9 | 10 | 11 | 12;
type DesktopColRange = DesktopCol | 13;
export interface IColumns extends React.HTMLAttributes<HTMLDivElement> {
	"data-testid"?: string | undefined;
	/**
	 * Specifies the number of columns to be span across in mobile viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 * If `tabletCols` or `desktopCols` are not specified, this
	 * setting will be applied to tablet and desktop viewports.
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 * @deprecated Use design system v3 columns: `xxs` / `xs` / `sm`
	 */
	mobile?: MobileCol | [MobileColRange, MobileColRange] | undefined;
	/**
	 * Specifies the number of columns to be span across in tablet viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 * If `desktopCols` are not specified, this setting will be
	 * applied to desktop viewports as well.
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 * @deprecated Use design system v3 columns: `lg`
	 */
	tablet?: TabletCol | [TabletColRange, TabletColRange] | undefined;
	/**
	 * Specifies the number of columns to be span across in desktop viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 * @deprecated Use design system v3 columns: `xl` / `xxl`
	 */
	desktop?: DesktopCol | [DesktopColRange, DesktopColRange] | undefined;
	xxl?: never | undefined;
	xl?: never | undefined;
	lg?: never | undefined;
	md?: never | undefined;
	sm?: never | undefined;
	xs?: never | undefined;
	xxs?: never | undefined;
}

export interface IV3Columns extends React.HTMLAttributes<HTMLDivElement> {
	mobile?: never | undefined;
	tablet?: never | undefined;
	desktop?: never | undefined;
	/**
	 * Specifies the number of columns to be spanned across for any breakpoint.
	 * If an array is specified, the format is [startCol, endCol].
	 */
	xxl?: ColProps["xxsCols"] | undefined;
	xl?: ColProps["xlCols"] | undefined;
	lg?: ColProps["lgCols"] | undefined;
	md?: ColProps["mdCols"] | undefined;
	sm?: ColProps["smCols"] | undefined;
	xs?: ColProps["xsCols"] | undefined;
	xxs?: ColProps["xxsCols"] | undefined;
}

/**
 * JSON keys to omit from field schema when extending from other interfaces
 * - keys already defined in `IFrontendEngineBaseFieldJsonSchema` to prevent collision
 * - some inherited HTML attributes
 */
type JsonSchemaOmitKeys = "id" | "label" | "validation" | "uiType" | "showIf" | "children" | "value";

// NOTE: undefined allows aggregation of keys if exists
type UnionOptionalKeys<T = undefined> = T extends string | number | symbol
	? JsonSchemaOmitKeys | T
	: JsonSchemaOmitKeys;

/**
 * Omits clashing keys between native props and frontend engine
 */
export type TComponentOmitProps<T, V = undefined> = Omit<T, UnionOptionalKeys<V>>;
