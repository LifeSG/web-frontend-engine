import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues, TWarningPayload } from "../../components/frontend-engine/types";
/**
 * Hook that handles the generation of the validationSchema
 */
export declare const useValidationSchema: () => {
    warnings: TWarningPayload;
    softValidationSchema: Yup.ObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>, import("yup/lib/object").AssertsShape<ObjectShape>>;
    hardValidationSchema: Yup.ObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>, import("yup/lib/object").AssertsShape<ObjectShape>>;
    rebuildValidationSchema: () => void;
    performSoftValidation: (schema: Yup.ObjectSchema<ObjectShape>, data: TFrontendEngineValues) => void;
    addWarnings: (warningPayload: TWarningPayload) => void;
    yupId: string;
};