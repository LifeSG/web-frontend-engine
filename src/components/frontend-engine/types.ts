import { ControllerFieldState, ControllerRenderProps, ValidationMode } from "react-hook-form";
import { FormFieldProps } from "react-lifesg-design-system/components/types";
import { AnyObjectSchema } from "yup";
import { ITextareaSchema } from "../fields/textarea/types";

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
// SCHEMAS
// ================================================
export const VALIDATION_TYPES = ["string", "number", "boolean", "array", "object"] as const;
export const VALIDATION_CONDITIONS = ["maxLength", "minLength", "maxValue", "minValue", "required"] as const;
export type TValidationType = typeof VALIDATION_TYPES[number];
export type TValidationCondition = typeof VALIDATION_CONDITIONS[number];
export type TValidationRuleKey = TValidationCondition | TValidationType;
export type TValidationRuleValue = { message?: string; value?: number };
export type TValidationRule = Partial<Record<TValidationRuleKey, TValidationRuleValue>>;
export type TFrontendEngineValidationSchema = TValidationType | TValidationRule;

// TODO: Add conditional rendering
export interface IFrontendEngineBaseFieldJsonSchema extends Omit<FormFieldProps, "type"> {
	id: string;
	title: string;
	validation?: TFrontendEngineValidationSchema[];
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
