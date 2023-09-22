/// <reference types="react" />
import { UseFormReturn } from "react-hook-form";
import { TFrontendEngineValues } from "../../components";
export declare const useFormValues: (formMethods?: UseFormReturn | undefined) => {
    formValues: Record<string, unknown>;
    getField: (id: string) => unknown;
    setFields: (values: Record<string, unknown>) => void;
    setField: (id: string, value: unknown) => void;
    resetFields: (values: Record<string, unknown>) => void;
    registeredFields: string[];
    setRegisteredFields: import("react").Dispatch<import("react").SetStateAction<string[]>>;
    getFormValues: (stripUnknown?: boolean) => TFrontendEngineValues;
};
