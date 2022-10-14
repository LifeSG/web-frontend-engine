import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { ISubmitButtonSchema } from "../fields";
import { ITextareaSchema } from "../fields/textarea/types";
import { IValidationRule } from "./validation-schema/types";

// ================================================
// FRONTEND ENGINE
// ================================================
type TValidationMode = keyof ValidationMode;
type TRevalidationMode = Exclude<keyof ValidationMode, "onTouched" | "all">;
export interface IFrontendEngineProps {
	id?: string | undefined;
	className?: string;
	data?: IFrontendEngineData | undefined;
	defaultValues?: TFrontendEngineValues | undefined;
	validationSchema?: AnyObjectSchema | undefined;
	validators?: IFrontendEngineValidator[] | undefined;
	conditions?: IFrontendEngineCondition[] | undefined;
	validationMode: TValidationMode;
	revalidationMode?: TRevalidationMode | undefined;
	onSubmit?: () => unknown | undefined;
	onValidate?: (isValid: boolean) => void | undefined;
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

export type TFrontendEngineFieldSchema = ITextareaSchema | ISubmitButtonSchema;

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
	validation?: IValidationRule[] | undefined;
}

export enum FieldType {
	TEXTAREA = "TextArea",
	SUBMIT = "SubmitButton",
}

// ================================================
// FIELD PROPS
// ================================================
export interface IGenericFieldProps<T = any> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	schema: T;
}
