import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { IYupValidationRule } from "../../components/frontend-engine/yup";
/**
 * Hook that interacts with the validation schema context provider
 * use this hook to get/set the validationSchema and config
 */
export declare const useValidationSchema: () => {
    validationSchema: Yup.ObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>, import("yup/lib/object").AssertsShape<ObjectShape>>;
    formValidationConfig: import("../../components/frontend-engine/yup").TFormYupConfig;
    setFieldValidationConfig: <V = IYupValidationRule>(id: string, schema: Yup.AnySchema, validationRules?: V[]) => void;
    removeFieldValidationConfig: (id: string) => void;
};
