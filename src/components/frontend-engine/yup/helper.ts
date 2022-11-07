import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	IYupConditionalValidationRule,
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
	export const mapRules = (yupSchema: Yup.AnySchema, schemaRules: IYupCombinedRule[]): Yup.AnySchema => {
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
				case !!rule.positive:
				case !!rule.negative:
				case !!rule.integer:
					yupSchema = (yupSchema as unknown)[ruleKey](rule.errorMessage);
					break;
				case rule.length > 0:
				case rule.min > 0:
				case rule.max > 0:
				case !!rule.lessThan:
				case !!rule.moreThan:
				case !!rule.filled:
				case !!rule.empty:
				case !!rule.equals:
				case !!rule.notEquals:
				case !!rule.includes:
				case !!rule.excludes:
				case !!rule.uinfin:
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
							const isRule = rule.when[fieldId].is;
							const thenRule = mapRules(
								mapSchemaType(yupSchema.type as TYupSchemaType),
								rule.when[fieldId].then
							);
							const otherwiseRule =
								rule.when[fieldId].otherwise &&
								mapRules(mapSchemaType(yupSchema.type as TYupSchemaType), rule.when[fieldId].otherwise);

							if (Array.isArray(isRule) && (isRule as unknown[]).every((r) => typeof r === "object")) {
								yupSchema = yupSchema.when(fieldId, (value: unknown, fieldYupSchema: Yup.AnySchema) => {
									const localYupSchema = mapRules(
										fieldYupSchema.clone(),
										isRule as IYupConditionalValidationRule[]
									);
									let fulfilled = false;
									try {
										localYupSchema.validateSync(value);
										fulfilled = true;
									} catch (error) {}

									return fulfilled ? thenRule : otherwiseRule;
								});
							} else {
								yupSchema = yupSchema.when(fieldId, {
									is: isRule,
									then: thenRule,
									otherwise: otherwiseRule,
								});
							}
						});
					}
					break;
			}
		});

		return yupSchema;
	};

	/**
	 * Declare custom Yup schema condition
	 * @param type The schema type
	 * @param name Name of the condition
	 * @param fn Validation function, it must return a boolean
	 */
	export const addCondition = (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: (value: unknown, arg: unknown, context: Yup.TestContext) => boolean
	) => {
		Yup.addMethod<Yup.AnySchema>(Yup[type], name, function (arg: unknown, errorMessage: string) {
			return this.test({
				name,
				message: errorMessage,
				test: (value, testContext) => fn(value, arg, testContext),
			});
		});
	};
}
