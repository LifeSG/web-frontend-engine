/// <reference types="react" />
import { IFrontendEngineRef, TFrontendEngineFieldSchema, TFrontendEngineValues } from "../../types";
interface ArrayFieldElementProps {
    onChange: (data: TFrontendEngineValues, isFormValid: boolean) => void;
    schema: Record<string, TFrontendEngineFieldSchema>;
    formValues?: TFrontendEngineValues;
}
export declare const ArrayFieldElement: import("react").ForwardRefExoticComponent<ArrayFieldElementProps & import("react").RefAttributes<IFrontendEngineRef>>;
export {};
