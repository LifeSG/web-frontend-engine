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
import { ERROR_MESSAGES } from "../../shared";

interface IYupCombinedRule extends IYupRenderRule, IYupValidationRule {}

export namespace YupHelper {
	const customYupConditions: string[] = [];

	// Yup's escape hatch for cycling dependency error
	// this happens when 2 fields have conditional validation that rely on each other
	// typically used to ensure user fill in one of many fields
	// https://github.com/jquense/yup/issues/176#issuecomment-367352042
	const whenPairIds: [string, string][] = [];

	/**
	 * Constructs the entire Yup schema for frontend engine to use
	 * @param yupSchemaConfig JSON representation of the eventual Yup schema
	 * @returns Yup schema ready to be used by FrontendEngine
	 */
	export const buildSchema = (yupSchemaConfig: TFormYupConfig): Yup.ObjectSchema<ObjectShape> => {
		const yupSchema: ObjectShape = {};
		const parsedYupSchemaConfig = parseWhenKeys(yupSchemaConfig);
		Object.keys(parsedYupSchemaConfig).forEach((id) => {
			const { schema, validationRules: fieldValidationConfig } = yupSchemaConfig[id];
			yupSchema[id] = buildFieldSchema(schema, fieldValidationConfig);
		});

		return Yup.object().shape(yupSchema, whenPairIds);
	};

	/**
	 * Iterates through field configs to look for conditional validation rules (`when` condition)
	 * For each conditional validation rule, it will refer to the source field to generate the corresponding yup schema
	 * @param fieldConfigs config containing the yup schema and validation config on each field
	 * @returns parsed field config
	 */
	const parseWhenKeys = (yupSchemaConfig: TFormYupConfig) => {
		const parsedFieldConfigs = { ...yupSchemaConfig };
		Object.entries(parsedFieldConfigs).forEach(([id, { validationRules }]) => {
			const notWhenRules = validationRules?.filter((rule) => !("when" in rule)) || [];
			const whenRules =
				validationRules
					?.filter((rule) => "when" in rule)
					.map((rule) => {
						const parsedRule = { ...rule };
						Object.keys(parsedRule.when).forEach((whenFieldId) => {
							parsedRule.when[whenFieldId] = {
								...parsedRule.when[whenFieldId],
								yupSchema: parsedFieldConfigs[whenFieldId].schema,
							};
							whenPairIds.push([id, whenFieldId]);
						});
						return parsedRule;
					}) || [];
			parsedFieldConfigs[id].validationRules = [...notWhenRules, ...whenRules];
		});
		return parsedFieldConfigs;
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
		const validationRules = fieldValidationConfig.filter(
			(config) =>
				YUP_CONDITIONS.includes(Object.keys(config)[0] as TYupCondition) ||
				customYupConditions.includes(Object.keys(config)[0] as TYupCondition)
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
				return Yup.boolean().strict().typeError("Only boolean values are allowed");
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
	 * @param schemaRules An array of validation rules to be mapped against validation type (e.g. a string schema might contain { maxLength: 255 })
	 * @returns yupSchema with added constraints and validations
	 */
	export const mapRules = <V extends IYupCombinedRule>(yupSchema: Yup.AnySchema, schemaRules: V[]): Yup.AnySchema => {
		schemaRules.forEach((rule) => {
			const ruleKey = Object.keys(rule).filter((k) =>
				YUP_CONDITIONS.includes(k as TYupCondition)
			)?.[0] as TYupCondition;

			switch (true) {
				case rule.required:
					yupSchema = yupSchema.required(rule.errorMessage || ERROR_MESSAGES.COMMON.FIELD_REQUIRED);
					break;
				case !!rule.email:
				case !!rule.url:
				case !!rule.uuid:
				case !!rule.positive:
				case !!rule.negative:
				case !!rule.integer:
					try {
						yupSchema = (yupSchema as unknown)[ruleKey](rule.errorMessage);
					} catch (error) {
						console.warn(`error applying "${ruleKey}" condition to ${yupSchema.type} schema`);
					}
					break;
				case rule.length > 0:
				case rule.min > 0:
				case rule.max > 0:
				case !!rule.lessThan:
				case !!rule.moreThan:
					try {
						yupSchema = (yupSchema as unknown)[ruleKey](rule[ruleKey], rule.errorMessage);
					} catch (error) {
						console.warn(`error applying "${ruleKey}" condition to ${yupSchema.type} schema`);
					}
					break;
				case !!rule.matches:
					{
						const matches = rule.matches.match(/\/(.*)\/([a-z]+)?/);
						try {
							yupSchema = (yupSchema as Yup.StringSchema).matches(
								new RegExp(matches[1], matches[2]),
								rule.errorMessage
							);
						} catch (error) {
							console.warn(`error applying "${ruleKey}" condition to ${yupSchema.type} schema`);
						}
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
								yupSchema = yupSchema.when(fieldId, (value: unknown) => {
									const localYupSchema = mapRules(
										rule.when[fieldId].yupSchema.clone(),
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

			// for custom defined rules
			const customRuleKey = Object.keys(rule).filter((k) =>
				customYupConditions.includes(k as TYupCondition)
			)?.[0] as TYupCondition;
			if (customRuleKey) {
				yupSchema = (yupSchema as unknown)[customRuleKey](rule[customRuleKey], rule.errorMessage);
			}

			// prevent applying non-required validation for empty fields
			yupSchema = yupSchema.transform((value) => {
				if (value === null || value === "" || (typeof value === "object" && Object.keys(value).length === 0))
					return undefined;
				return value;
			});
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
		if (customYupConditions.includes(name)) {
			console.warn(`the validation condition "${name}" is not added because it already exists!`);
			return;
		}
		customYupConditions.push(name);
		Yup.addMethod<Yup.AnySchema>(Yup[type], name, function (arg: unknown, errorMessage: string) {
			return this.test({
				name,
				message: errorMessage,
				test: (value, testContext) => fn(value, arg, testContext),
			});
		});
	};
}
