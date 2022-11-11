import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import {
	ICheckboxGroupSchema,
	IContactNumberSchema,
	IDateInputSchema,
	IEmailSchema,
	IMultiSelectSchema,
	INumberSchema,
	ISelectSchema,
	ISubmitButtonSchema,
	ITextareaSchema,
	ITextfieldSchema,
	ITimePickerSchema,
} from "../fields";
import { IChipsSchema } from "../fields/chips";
import { IRadioButtonGroupSchema } from "../fields/radio-button/types";
import { IWrapperSchema } from "../fields/wrapper";
import { IYupValidationRule, TRenderRules } from "./yup";

// =============================================================================
// FRONTEND ENGINE
// =============================================================================
export interface IFrontendEngineProps {
	className?: string;
	data?: IFrontendEngineData | undefined;
	onChange?: (values: TFrontendEngineValues, isValid?: boolean | undefined) => unknown | undefined;
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
}

export interface IFrontendEngineData {
	className?: string | undefined;
	// conditions?: IFrontendEngineCondition[]; TODO: add custom validation
	defaultValues?: TFrontendEngineValues | undefined;
	fields: Record<string, TFrontendEngineFieldSchema>;
	id?: string | undefined;
	revalidationMode?: TRevalidationMode | undefined;
	validationMode?: TValidationMode | undefined;
}

export type TFrontendEngineFieldSchema =
	| ITextareaSchema
	| ITextfieldSchema
	| IEmailSchema
	| INumberSchema
	| ISubmitButtonSchema
	| ISelectSchema
	| IMultiSelectSchema
	| ICheckboxGroupSchema
	| IDateInputSchema
	| IWrapperSchema
	| IContactNumberSchema
	| IRadioButtonGroupSchema
	| ITimePickerSchema
	| IChipsSchema;

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

export enum EFieldType {
	TEXTAREA = "TextArea",
	TEXT = "TextField",
	NUMBER = "TextField",
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
}

// =============================================================================
// FIELD PROPS
// =============================================================================
export interface IGenericFieldProps<T = any> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	id: string;
	schema: T;
}
