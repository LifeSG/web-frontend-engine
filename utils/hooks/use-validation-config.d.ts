import * as Yup from "yup";
import { IYupValidationRule } from "../../components/frontend-engine/yup";
/**
 * Hook that interacts with the validation config
 */
export declare const useValidationConfig: () => {
    formValidationConfig: import("../../components/frontend-engine/yup").TFormYupConfig;
    setFieldValidationConfig: <V = IYupValidationRule>(id: string, schema: Yup.AnySchema, validationRules?: V[]) => void;
    removeFieldValidationConfig: (id: string) => void;
};
