import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues } from "../../components/frontend-engine/types";
/**
 * Hook that handles the generation of the validationSchema
 */
export declare const useValidationSchema: () => {
    warnings: Record<string, string>;
    softValidationSchema: Yup.ObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>, import("yup/lib/object").AssertsShape<ObjectShape>>;
    hardValidationSchema: Yup.ObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>, import("yup/lib/object").AssertsShape<ObjectShape>>;
    performSoftValidation: (schema: Yup.ObjectSchema<ObjectShape>, data: TFrontendEngineValues) => void;
};
