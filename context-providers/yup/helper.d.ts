import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { IYupRenderRule, IYupValidationRule, TCustomValidationFunction, TFormYupConfig, TYupSchemaType } from "./types";
interface IYupCombinedRule extends IYupRenderRule, IYupValidationRule {
}
export declare namespace YupHelper {
    /**
     * Constructs the entire Yup schema for frontend engine to use
     * @param yupSchemaConfig JSON representation of the eventual Yup schema
     * @param yupId Optionally assign an id to the schema for custom validation
     * @returns Yup schema ready to be used by FrontendEngine
     */
    const buildSchema: (yupSchemaConfig: TFormYupConfig, yupId?: string | undefined) => Yup.ObjectSchema<ObjectShape>;
    /**
     * Creates a yupSchema for a given field
     * @param yupSchemaField Yup schema for individual field
     * @param fieldValidationConfig JSON representation of the Yup schema
     * @returns yupSchema corresponding to the specified validations and constraints
     */
    const buildFieldSchema: (yupSchemaField: Yup.AnySchema, fieldValidationConfig: IYupCombinedRule[]) => Yup.AnySchema;
    /**
     * Initialises a Yup schema according to the type provided
     * @param type The schema type
     * @returns yupSchema that corresponds to the validation type
     */
    const mapSchemaType: (type: TYupSchemaType) => import("yup/lib/object").OptionalObjectSchema<ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<ObjectShape>> | Yup.StringSchema<string, import("yup/lib/types").AnyObject, string> | Yup.NumberSchema<number, import("yup/lib/types").AnyObject, number> | Yup.BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean> | import("yup/lib/array").OptionalArraySchema<Yup.AnySchema<any, any, any>, import("yup/lib/types").AnyObject, any[]> | import("yup/lib/mixed").MixedSchema<any, import("yup/lib/types").AnyObject, any>;
    /**
     * Adds Yup validation and constraints based on specified rules
     * @param yupSchema Yup schema that was previously created from specified validation type
     * @param schemaRules An array of validation rules to be mapped against validation type (e.g. a string schema might contain { maxLength: 255 })
     * @returns yupSchema with added constraints and validations
     */
    const mapRules: <V extends IYupCombinedRule>(yupSchema: Yup.AnySchema, schemaRules: V[]) => Yup.AnySchema;
    /**
     * Declare custom Yup schema condition
     * @param type The schema type
     * @param name Name of the condition
     * @param fn Validation function, it must return a boolean
     * @param yupId Assign the custom condition to a specific schema
     * @param overwrite Whether to replace if the custom validation is already exists
     */
    const addCondition: (type: TYupSchemaType | "mixed", name: string, fn: TCustomValidationFunction, yupId?: string | undefined, overwrite?: boolean) => void;
}
export {};
