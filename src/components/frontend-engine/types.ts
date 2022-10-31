import { ControllerFieldState, ControllerRenderProps, FormState, ValidationMode } from "react-hook-form";
import {
	ICheckboxGroupSchema,
	IDateInputSchema,
	IEmailSchema,
	IMultiSelectSchema,
	INumberSchema,
	ISelectSchema,
	ISubmitButtonSchema,
	ITextareaSchema,
	ITextfieldSchema,
} from "../fields";
import { IWrapperSchema } from "../fields/wrapper";
import { IYupRule } from "./yup/types";

// =============================================================================
// FRONTEND ENGINE
// =============================================================================
export interface IFrontendEngineProps {
	className?: string;
	data?: IFrontendEngineData | undefined;
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
	| IWrapperSchema;

export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;

export interface IFrontendEngineRef extends HTMLFormElement {
	/** gets information about the entire form state */
	getFormState: () => FormState<TFrontendEngineValues>;
	/** triggers form submission */
	submit: () => void;
}

// =============================================================================
// JSON SCHEMA
// =============================================================================
export interface IFrontendEngineBaseFieldJsonSchema<T> {
	fieldType: T;
	label: string;
	validation?: IYupRule[] | undefined;
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
}

// =============================================================================
// FIELD PROPS
// =============================================================================
export interface IGenericFieldProps<T = any> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	id: string;
	schema: T;
}
