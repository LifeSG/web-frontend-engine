import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import { ISelectSchema, ISubmitButtonSchema, ITextareaSchema, ITextfieldSchema } from "../fields";
import { IValidationRule } from "./validation-schema/types";

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
	fields: TFrontendEngineFieldSchema[];
	id?: string | undefined;
	revalidationMode?: TRevalidationMode | undefined;
	validationMode?: TValidationMode | undefined;
}

export type TFrontendEngineFieldSchema = ITextareaSchema | ITextfieldSchema | ISubmitButtonSchema | ISelectSchema;
export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;
export type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export type TValidationMode = keyof ValidationMode;

// =============================================================================
// JSON SCHEMA
// =============================================================================
export interface IFrontendEngineBaseFieldJsonSchema<T> {
	type: T;
	id: string;
	title: string;
	validation?: IValidationRule[] | undefined;
}

export type TFrontendEngineBaseFieldJsonSchemaKeys = "id" | "title" | "validation" | "type";

export enum FieldType {
	TEXTAREA = "TextArea",
	TEXT = "TextField",
	NUMBER = "TextField",
	EMAIL = "TextField",
	SUBMIT = "SubmitButton",
	SELECT = "Select",
}

// =============================================================================
// FIELD PROPS
// =============================================================================
export interface IGenericFieldProps<T = any> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	schema: T;
}
