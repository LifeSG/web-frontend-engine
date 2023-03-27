import { ControllerFieldState, ControllerRenderProps, UseFormSetValue, ValidationMode } from "react-hook-form";
import { IAlertSchema, ITextSchema } from "../elements";
import { IWrapperSchema } from "../elements/wrapper";
import {
	ICheckboxGroupSchema,
	IChipsSchema,
	IContactNumberSchema,
	IDateFieldSchema,
	IEmailFieldSchema,
	IMultiSelectSchema,
	INumericFieldSchema,
	IRadioButtonGroupSchema,
	ISelectSchema,
	ISubmitButtonSchema,
	ITextFieldSchema,
	ITextareaSchema,
	ITimeFieldSchema,
} from "../fields";
import { IYupValidationRule, TRenderRules, TYupSchemaType } from "./yup";

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
	/** JSON configuration to define the fields and functionalities of the form */
	data?: IFrontendEngineData<V> | undefined;
	/** Fires every time a value changes in any fields */
	onChange?: ((values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown) | undefined;
	/** Submit event handler, will receive the form data if form validation is successful */
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
}

export interface IFrontendEngineData<V = undefined> {
	/** HTML class attribute */
	className?: string | undefined;
	/** Fields' initial values on mount. The key of each field needs to match the id used in the field */
	defaultValues?: TFrontendEngineValues | undefined;
	/** All elements within the form in key-value format, key refers to the id of the field while value refers to the JSON schema of the field */
	fields: Record<string, TFrontendEngineFieldSchema<V>>;
	/** Unique HTML id attribute that is applied on the `<form>` element */
	id?: string | undefined;
	/** Validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event) */
	revalidationMode?: TRevalidationMode | undefined;
	/** Validation strategy before a user submits the form (onSubmit event) */
	validationMode?: TValidationMode | undefined;
}

export type TFrontendEngineFieldSchema<V = undefined> =
	| ITextareaSchema<V>
	| ITextFieldSchema<V>
	| IEmailFieldSchema<V>
	| INumericFieldSchema<V>
	| ISubmitButtonSchema
	| ISelectSchema<V>
	| IMultiSelectSchema<V>
	| ICheckboxGroupSchema<V>
	| IDateFieldSchema<V>
	| IWrapperSchema
	| IContactNumberSchema<V>
	| IRadioButtonGroupSchema<V>
	| ITimeFieldSchema<V>
	| IChipsSchema<V>
	| IAlertSchema
	| ITextSchema;

export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;

export type TErrorMessage = string | string[] | Record<string, string | string[]>;
export type TErrorPayload = Record<string, TErrorMessage>;
export interface IFrontendEngineRef extends HTMLFormElement {
	/** gets form values */
	getValues: () => TFrontendEngineValues;
	/** set field value by id */
	setValue: UseFormSetValue<TFrontendEngineValues>;
	/** check if form is valid */
	isValid: () => boolean;
	/** triggers form submission */
	submit: () => void;

	addCustomValidation: (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: (value: unknown, arg: unknown) => boolean
	) => void;

	/** allow setting of custom errors thrown by endpoints */
	setErrors: (errors: TErrorPayload) => void;
}

// =============================================================================
// JSON SCHEMA
// =============================================================================
// NOTE: U generic is for internal use, prevents getting overwritten by custom validation types
export interface IFrontendEngineBaseFieldJsonSchema<T, V = undefined, U = undefined> {
	/** defines what kind of field to be rendered */
	uiType: T;
	/** caption for the field */
	label: string;
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	/** validation config, can be customised by passing generics */
	validation?: (V | U | IYupValidationRule)[];
}

/**
 * JSON keys to omit from field schema when extending from other interfaces
 * - keys already defined in `IFrontendEngineBaseFieldJsonSchema` to prevent collision
 * - some inherited HTML attributes
 */
export type TFrontendEngineFieldJsonSchemaOmitKeys =
	| "id"
	| "label"
	| "validation"
	| "uiType"
	| "showIf"
	| "children"
	| "value";

// NOTE: Form elements should not support validation nor contain labels
export interface IFrontendEngineElementJsonSchema<T>
	extends Omit<IFrontendEngineBaseFieldJsonSchema<T>, "label" | "validation"> {}

// NOTE: undefined allows aggregation of keys if exists
type UnionOptionalKeys<T = undefined> = T extends string | number | symbol
	? TFrontendEngineFieldJsonSchemaOmitKeys | T
	: TFrontendEngineFieldJsonSchemaOmitKeys;

// NOTE: Omit clashing keys between native props and frontend engine
export type TComponentOmitProps<T, V = undefined> = Omit<T, UnionOptionalKeys<V>>;

export enum EFieldType {
	TEXTAREA = "Textarea",
	"TEXT-FIELD" = "TextField",
	"NUMERIC-FIELD" = "TextField",
	"EMAIL-FIELD" = "TextField",
	SUBMIT = "SubmitButton",
	SELECT = "Select",
	"MULTI-SELECT" = "MultiSelect",
	"DATE-FIELD" = "DateField",
	CHECKBOX = "CheckboxGroup",
	CONTACT = "ContactNumber",
	RADIO = "RadioButtonGroup",
	"TIME-FIELD" = "TimeField",
	CHIPS = "Chips",
}

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
	SPAN = "Wrapper",
	SECTION = "Wrapper",
	HEADER = "Wrapper",
	FOOTER = "Wrapper",
	H1 = "Wrapper",
	H2 = "Wrapper",
	H3 = "Wrapper",
	H4 = "Wrapper",
	H5 = "Wrapper",
	H6 = "Wrapper",
	P = "Wrapper",
}

// =============================================================================
// FIELD PROPS
// =============================================================================
export interface IGenericFieldProps<T = TFrontendEngineFieldSchema>
	extends Partial<ControllerFieldState>,
		Partial<ControllerRenderProps> {
	id: string;
	schema: T;
}
