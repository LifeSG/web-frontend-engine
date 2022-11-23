import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import { IAlertSchema, ITextSchema } from "../elements";
import { IWrapperSchema } from "../elements/wrapper";
import {
	ICheckboxGroupSchema,
	IChipsSchema,
	IContactNumberSchema,
	IDateInputSchema,
	IEmailSchema,
	IMultiSelectSchema,
	INumberSchema,
	IRadioButtonGroupSchema,
	ISelectSchema,
	ISubmitButtonSchema,
	ITextareaSchema,
	ITextfieldSchema,
	ITimePickerSchema,
} from "../fields";
import { IYupValidationRule, TRenderRules, TYupSchemaType } from "./yup";

// =============================================================================
// FRONTEND ENGINE
// =============================================================================
export interface IFrontendEngineProps {
	className?: string | undefined;
	data?: IFrontendEngineData | undefined;
	onChange?: ((values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown) | undefined;
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
}

export interface IFrontendEngineData<V = IYupValidationRule> {
	className?: string | undefined;
	defaultValues?: TFrontendEngineValues | undefined;
	fields: Record<string, TFrontendEngineFieldSchema<V>>;
	id?: string | undefined;
	revalidationMode?: TRevalidationMode | undefined;
	validationMode?: TValidationMode | undefined;
}

export type TFrontendEngineFieldSchema<V = IYupValidationRule> =
	| ITextareaSchema<V>
	| ITextfieldSchema<V>
	| IEmailSchema<V>
	| INumberSchema<V>
	| ISubmitButtonSchema
	| ISelectSchema<V>
	| IMultiSelectSchema<V>
	| ICheckboxGroupSchema<V>
	| IDateInputSchema<V>
	| IWrapperSchema
	| IContactNumberSchema<V>
	| IRadioButtonGroupSchema<V>
	| ITimePickerSchema<V>
	| IChipsSchema<V>
	| IAlertSchema
	| ITextSchema;

export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;

export interface IFrontendEngineRef extends HTMLFormElement {
	/** gets form values */
	getValues: () => TFrontendEngineValues;
	/** check if form is valid */
	isValid: () => boolean;
	/** triggers form submission */
	submit: () => void;

	addCustomValidation: (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: (value: unknown, arg: unknown) => boolean
	) => void;
}

// =============================================================================
// JSON SCHEMA
// =============================================================================
export interface IFrontendEngineBaseFieldJsonSchema<T, V = IYupValidationRule> {
	fieldType: T;
	label: string;
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	validation?: V[] | undefined;
}

export type TFrontendEngineBaseFieldJsonSchemaKeys = "id" | "label" | "validation" | "fieldType";

// NOTE: Form elements should not support validation nor contain labels
export interface IFrontendEngineElementJsonSchema<T>
	extends Omit<IFrontendEngineBaseFieldJsonSchema<T>, "label" | "validation"> {}

// NOTE: undefined allows aggregation of keys if exists
type UnionOptionalKeys<T = undefined> = T extends string | number | symbol
	? TFrontendEngineBaseFieldJsonSchemaKeys | T
	: TFrontendEngineBaseFieldJsonSchemaKeys;

// NOTE: Omit clashing keys between native props and frontend engine
export type TComponentOmitProps<T, V = undefined> = Omit<T, UnionOptionalKeys<V>>;

export enum EFieldType {
	TEXTAREA = "TextArea",
	TEXT = "TextField",
	NUMERIC = "TextField",
	EMAIL = "TextField",
	SUBMIT = "SubmitButton",
	SELECT = "Select",
	"MULTI-SELECT" = "MultiSelect",
	DATE = "DateInput",
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
	CHECKBOX = "CheckboxGroup",
	CONTACT = "ContactNumber",
	RADIO = "RadioButtonGroup",
	TIME = "TimePicker",
	CHIPS = "Chips",
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
