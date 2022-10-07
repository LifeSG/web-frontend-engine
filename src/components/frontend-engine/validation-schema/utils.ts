import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	IValidationRule,
	TFormValidationConfig,
	TValidationCondition,
	TValidationType,
	VALIDATION_CONDITIONS,
} from "./types";

// TODO: custom validation
export namespace ValidationSchemaUtils {
	/**
	 * Constructs the entire Yup schema for frontend engine to use
	 * @param formValidationConfig JSON representation of the eventual Yup schema
	 * @returns Yup schema ready to be used by FrontendEngine
	 */
	export const buildYupSchema = (formValidationConfig: TFormValidationConfig): Yup.ObjectSchema<ObjectShape> => {
		const yupSchema: ObjectShape = {};
		Object.keys(formValidationConfig).forEach((id) => {
			const { schema, validationRules: fieldValidationConfig } = formValidationConfig[id];
			yupSchema[id] = buildFieldYupSchema(schema, fieldValidationConfig);
		});
		return Yup.object().shape(yupSchema);
	};

	/**
	 * Creates a yupSchema for a given field
	 * @param yupSchemaField Yup schema for individual field
	 * @param fieldValidationConfig JSON representation of the Yup schema
	 * @returns yupSchema corresponding to the specified validations and constraints
	 */
	const buildFieldYupSchema = (
		yupSchemaField: Yup.AnySchema,
		fieldValidationConfig: IValidationRule[]
	): Yup.AnySchema => {
		const validationRules = fieldValidationConfig.filter((config) =>
			VALIDATION_CONDITIONS.includes(Object.keys(config)[0] as TValidationCondition)
		);
		return mapYupConditions(yupSchemaField, validationRules);
	};

	/**
	 * Initialises a Yup schema according to the type provided
	 * @param type The schema type
	 * @returns yupSchema that corresponds to the validation type
	 */
	const mapYupSchema = (type: TValidationType) => {
		// TODO: allow customising of the typeError message?
		switch (type) {
			case "string":
				return Yup.string().typeError("Only string values are allowed");
			case "number":
				return Yup.number().typeError("Only number values are allowed");
			case "boolean":
				return Yup.boolean().typeError("Only boolean values are allowed");
			case "array":
				return Yup.array().typeError("Only array values are allowed");
			case "object":
				return Yup.object().typeError("Only object values are allowed");
			default:
				return Yup.mixed();
		}
	};

	/**
	 * Adds Yup validation and constraints based on specified rules
	 * @param yupSchema Yup schema that was previously created from specified validation type
	 * @param validationRules An array of validation rules to be mapped against validation type (i.e. a string schema might contain { maxLength: 255 })
	 * @returns yupSchema with added constraints and validations
	 */
	const mapYupConditions = (yupSchema: Yup.AnySchema, validationRules: IValidationRule[]): Yup.AnySchema => {
		validationRules.forEach((rule) => {
			switch (true) {
				case rule.required:
					yupSchema = yupSchema.required(rule.errorMessage || "This field is required");
					break;
				case rule.minLength > 0:
					yupSchema = (yupSchema as Yup.StringSchema).min(rule.minLength, rule.errorMessage);
					break;
				case rule.maxLength > 0:
					yupSchema = (yupSchema as Yup.StringSchema).max(rule.maxLength, rule.errorMessage);
					break;
			}
		});

		return yupSchema;
	};
}
