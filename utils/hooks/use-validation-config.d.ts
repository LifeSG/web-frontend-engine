import * as Yup from "yup";
import { IYupValidationRule } from "../../context-providers";
/**
 * Hook that interacts with the validation config
 */
export declare const useValidationConfig: () => {
    formValidationConfig: import("../../context-providers").TFormYupConfig;
    setFieldValidationConfig: <V = IYupValidationRule<undefined, undefined>>(id: string, schema: Yup.AnySchema, validationRules?: V[]) => void;
    removeFieldValidationConfig: (id: string) => void;
};
