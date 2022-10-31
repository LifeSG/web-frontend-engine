import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	IYupRenderRule,
	IYupValidationRule,
	TFormYupConfig,
	TYupCondition,
	TYupSchemaType,
	YUP_CONDITIONS,
} from "./types";

interface IYupCombinedRule extends IYupRenderRule, IYupValidationRule {}

// TODO: custom validation
export namespace YupHelper {
	/**
	 * Constructs the entire Yup schema for frontend engine to use
	 * @param yupSchemaConfig JSON representation of the eventual Yup schema
	 * @returns Yup schema ready to be used by FrontendEngine
	 */
	export const buildSchema = (yupSchemaConfig: TFormYupConfig): Yup.ObjectSchema<ObjectShape> => {
		const yupSchema: ObjectShape = {};
		Object.keys(yupSchemaConfig).forEach((id) => {
			const { schema, validationRules: fieldValidationConfig } = yupSchemaConfig[id];
			yupSchema[id] = buildFieldSchema(schema, fieldValidationConfig);
		});

		return Yup.object().shape(yupSchema);
	};

	/**
	 * Creates a yupSchema for a given field
	 * @param yupSchemaField Yup schema for individual field
	 * @param fieldValidationConfig JSON representation of the Yup schema
	 * @returns yupSchema corresponding to the specified validations and constraints
	 */
	export const buildFieldSchema = (
		yupSchemaField: Yup.AnySchema,
		fieldValidationConfig: IYupCombinedRule[]
	): Yup.AnySchema => {
		const validationRules = fieldValidationConfig.filter((config) =>
			YUP_CONDITIONS.includes(Object.keys(config)[0] as TYupCondition)
		);
		return mapRules(yupSchemaField, validationRules);
	};

	/**
	 * Initialises a Yup schema according to the type provided
	 * @param type The schema type
	 * @returns yupSchema that corresponds to the validation type
	 */
	export const mapSchemaType = (type: TYupSchemaType) => {
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
	 * @param schemaRules An array of validation rules to be mapped against validation type (i.e. a string schema might contain { maxLength: 255 })
	 * @returns yupSchema with added constraints and validations
	 */
	const mapRules = (yupSchema: Yup.AnySchema, schemaRules: IYupCombinedRule[]): Yup.AnySchema => {
		schemaRules.forEach((rule) => {
			const ruleKey = Object.keys(rule).filter((k) =>
				YUP_CONDITIONS.includes(k as TYupCondition)
			)?.[0] as TYupCondition;

			switch (true) {
				case rule.required:
					yupSchema = yupSchema.required(rule.errorMessage || "This field is required");
					break;
				case !!rule.email:
				case !!rule.url:
				case !!rule.uuid:
					yupSchema = (yupSchema as unknown)[ruleKey](rule.errorMessage);
					break;
				case rule.length > 0:
				case rule.min > 0:
				case rule.max > 0:
					yupSchema = (yupSchema as unknown)[ruleKey](rule[ruleKey], rule.errorMessage);
					break;
				case !!rule.matches:
					{
						const matches = rule.matches.match(/\/(.*)\/([a-z]+)?/);
						yupSchema = (yupSchema as Yup.StringSchema).matches(
							new RegExp(matches[1], matches[2]),
							rule.errorMessage
						);
					}
					break;
				case !!rule.when:
					{
						Object.keys(rule.when).forEach((fieldId) => {
							yupSchema = yupSchema.when(fieldId, {
								is: rule.when[fieldId].is,
								then: mapRules(
									mapSchemaType(yupSchema.type as TYupSchemaType),
									rule.when[fieldId].then
								),
								otherwise: mapRules(
									mapSchemaType(yupSchema.type as TYupSchemaType),
									rule.when[fieldId].otherwise
								),
							});
						});
					}
					break;
			}
		});

		return yupSchema;
	};
}
