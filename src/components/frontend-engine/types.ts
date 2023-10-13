import { UseFormReset, UseFormSetValue, ValidationMode } from "react-hook-form";
import { TCustomComponentSchema } from "../custom";
import { TElementSchema } from "../elements";
import { ISectionSchema } from "../elements/section";
import { TFieldSchema } from "../fields";
import { TYupSchemaType } from "./yup";

// =============================================================================
// YUP SCHEMA
// =============================================================================
export type { IYupValidationRule } from "./yup";

// =============================================================================
// FRONTEND ENGINE
// =============================================================================
export interface IFrontendEngineProps<V = undefined> {
	/** HTML class attribute that is applied on the `<form>` element */
	className?: string;
	/** JSON configuration to define the components and functionalities of the form */
	data?: IFrontendEngineData<V> | undefined;
	/** Fires every time a value changes in any fields */
	onChange?: ((values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown) | undefined;
	/** Submit event handler, will receive the form data if form validation is successful */
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
	/** Submit error event handler, invoked when form fails validation on submissiohn. Will receive validation errors */
	onSubmitError?: (errors: TFrontendEngineValues) => unknown | undefined;
}

export interface IFrontendEngineData<V = undefined> {
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
	sections: Record<string, ISectionSchema<V>>;
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

export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;
export type TRestoreMode = "none" | "default-value" | "user-input";
export type TErrorMessage = string | string[] | Record<string, string | string[]>;
export type TErrorPayload = Record<string, TErrorMessage>;

export interface IFrontendEngineRef extends HTMLFormElement {
	addCustomValidation: (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: (value: unknown, arg: unknown) => boolean
	) => void;
	addFieldEventListener: <T = any>(
		type: string,
		id: string,
		listener: (ev: CustomEvent<T>) => void,
		options?: boolean | AddEventListenerOptions
	) => void;
	dispatchFieldEvent: <T = any>(type: string, id: string, detail?: T) => boolean;
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
	/** adds custom validation rule */
	removeFieldEventListener: <T = any>(
		type: string,
		id: string,
		listener: (ev: CustomEvent<T>) => void,
		options?: boolean | EventListenerOptions
	) => void;
	/** resets the form to the default state */
	reset: UseFormReset<TFrontendEngineValues>;
	/** allows setting of custom errors thrown by endpoints */
	setErrors: (errors: TErrorPayload) => void;
	/** sets field value by id */
	setValue: UseFormSetValue<TFrontendEngineValues>;
	/** triggers form submission */
	submit: () => void;
}

// =============================================================================
// JSON SCHEMA
// =============================================================================
// contains all schema types except for sections schema
export type TFrontendEngineFieldSchema<V = undefined> = TFieldSchema<V> | TCustomComponentSchema | TElementSchema;

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

// =============================================================================
// HELPERS
// =============================================================================
/**
 * prevents inferrence
 * https://stackoverflow.com/questions/56687668/a-way-to-disable-type-argument-inference-in-generics
 */
export type TNoInfer<T, U> = [T][T extends U ? 0 : never];

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};
