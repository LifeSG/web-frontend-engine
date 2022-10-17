import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { ITextareaSchema } from "../fields/textarea/types";
import { IValidationRule } from "./validation-schema/types";

// ================================================
// FRONTEND ENGINE
// ================================================
type TValidationMode = keyof ValidationMode;
type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export interface IFrontendEngineProps {
	id?: string;
	className?: string;
	data?: IFrontendEngineData;
	defaultValues?: TFrontendEngineValues;
	validationSchema?: AnyObjectSchema;
	validators?: IFrontendEngineValidator[];
	conditions?: IFrontendEngineCondition[];
	validationMode: TValidationMode;
	revalidationMode?: TRevalidationMode;
	onSubmit?: () => unknown;
	onValidate?: (isValid: boolean) => void;
}

export type TFrontendEngineValues<T = any> = Record<keyof T, T[keyof T]>;

export interface IFrontendEngineValidator {
	ruleName: string;
	errorMessage: string;
	validate: (value: any) => boolean;
}

export interface IFrontendEngineCondition {
	conditionIds: string[];
	condition: (...values: any[]) => boolean;
}

export type TFrontendEngineFieldSchema = ITextareaSchema;

export interface IFrontendEngineData {
	fields: TFrontendEngineFieldSchema[];
}

// ================================================
// JSON SCHEMA
// ================================================
// TODO: Add conditional rendering
export interface IFrontendEngineBaseFieldJsonSchema<T> {
	type: T;
	id: string;
	title: string;
	validation?: IValidationRule[];
}

export enum FieldType {
	TEXTAREA = "TextArea",
}

// ================================================
// FIELD PROPS
// ================================================
export interface IGenericFieldProps<T = any> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	schema: T;
}
