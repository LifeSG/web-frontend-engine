import intersection from "lodash/intersection";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { ERROR_MESSAGES } from "../../components/shared";
import {
	IFieldYupConfig,
	IYupConditionalValidationRule,
	IYupRenderRule,
	IYupValidationRule,
	TCustomValidationFunction,
	TFormYupConfig,
	TYupCondition,
	TYupSchemaType,
	YUP_CONDITIONS,
} from "./types";

interface IYupCombinedRule extends IYupRenderRule, IYupValidationRule {}

export namespace YupHelper {
	const customYupConditions: string[] = [];
	const customValidationMapping: Record<string, Record<string, TCustomValidationFunction>> = {};

	/**
	 * Constructs the entire Yup schema for frontend engine to use
	 * @param yupSchemaConfig JSON representation of the eventual Yup schema
	 * @param yupId Optionally assign an id to the schema for custom validation
	 * @returns Yup schema ready to be used by FrontendEngine
	 */
	export const buildSchema = (
		yupSchemaConfig: TFormYupConfig,
		yupId?: string | undefined
	): Yup.ObjectSchema<ObjectShape> => {
		const yupSchema: ObjectShape = {};
		const [parsedYupSchemaConfig, whenPairIds] = parseWhenKeys(yupSchemaConfig);
		Object.keys(parsedYupSchemaConfig).forEach((id) => {
			const { schema, validationRules: fieldValidationConfig } = yupSchemaConfig[id];
			yupSchema[id] = buildFieldSchema(schema, fieldValidationConfig);
		});

		return Yup.object().meta({ yupId }).shape(yupSchema, whenPairIds);
	};

	/**
	 * Iterates through field configs to look for conditional validation rules (`when` condition)
	 * For each conditional validation rule, it will refer to the source field to generate the corresponding yup schema
	 * @param fieldConfigs config containing the yup schema and validation config on each field
	 * @returns parsed field config
	 */
	const parseWhenKeys = (fieldConfigs: TFormYupConfig): [Record<string, IFieldYupConfig>, [string, string][]] => {
		// Yup's escape hatch for cycling dependency error
		// this happens when 2 fields have conditional validation that rely on each other
		// typically used to ensure user fill in one of many fields
		// https://github.com/jquense/yup/issues/176#issuecomment-367352042
		const whenPairIds: [string, string][] = [];

		const parsedFieldConfigs = { ...fieldConfigs };
		Object.entries(parsedFieldConfigs).forEach(([id, { validationRules }]) => {
			const [parsedFieldConfig, fieldWhenPairIds] = addSchemaToWhenRules(id, fieldConfigs, validationRules);
			whenPairIds.push(...fieldWhenPairIds);
			parsedFieldConfigs[id].validationRules = parsedFieldConfig;
		});
		return [parsedFieldConfigs, whenPairIds];
	};

	/**
	 * Recursively adds validation schema to each when rule, including nested ones
	 * @param id id of the field with the when rule
	 * @param fieldConfigs the entire config containing the yup schema and validation config of each field
	 * @param fieldValidationConfig validation config of a single field
	 * @returns an array containing the parsed field config and conditional field id pairs
	 */
	const addSchemaToWhenRules = (
		id: string,
		fieldConfigs: TFormYupConfig,
		fieldValidationConfig: IYupValidationRule[]
	): [IYupValidationRule[], [string, string][]] => {
		const whenPairIds: [string, string][] = [];
		const parsedFieldValidationConfig =
			fieldValidationConfig?.filter((fieldValidationConfig) => !("when" in fieldValidationConfig)) || [];
		fieldValidationConfig
			?.filter((fieldValidationConfig) => "when" in fieldValidationConfig)
			.forEach((fieldValidationConfig) => {
				const parsedConfig = { ...fieldValidationConfig };
				Object.keys(parsedConfig.when).forEach((whenFieldId) => {
					// when
					whenPairIds.push([id, whenFieldId]);
					parsedConfig.when[whenFieldId] = {
						...parsedConfig.when[whenFieldId],
						yupSchema: fieldConfigs[whenFieldId].schema.clone(),
					};

					// then
					const [parsedThenRules, thenPairIds] = addSchemaToWhenRules(
						id,
						fieldConfigs,
						parsedConfig.when[whenFieldId].then
					);
					parsedConfig.when[whenFieldId].then = parsedThenRules;
					whenPairIds.push(...thenPairIds);
				});
				parsedFieldValidationConfig.push(parsedConfig);
			});
		return [parsedFieldValidationConfig, whenPairIds];
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
				intersection(YUP_CONDITIONS, Object.keys(config)).length > 0 ||
				intersection(customYupConditions, Object.keys(config)).length > 0
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
										rule.when[fieldId].yupSchema?.clone(),
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
	 * @param yupId Assign the custom condition to a specific schema
	 * @param overwrite Whether to replace if the custom validation is already exists
	 */
	export const addCondition = (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: TCustomValidationFunction,
		yupId?: string | undefined,
		overwrite = false
	) => {
		if (yupId) {
			if (!customValidationMapping[yupId]) {
				customValidationMapping[yupId] = {};
			}
			if (customValidationMapping[yupId][name] && overwrite !== true) {
				console.warn(`the validation condition "${name}" is not added because it already exists!`);
				return;
			}
			customValidationMapping[yupId][name] = fn;
		} else if (customYupConditions.includes(name) && overwrite !== true) {
			console.warn(`the validation condition "${name}" is not added because it already exists!`);
			return;
		}
		if (!customYupConditions.includes(name)) {
			customYupConditions.push(name);
		}

		Yup.addMethod<Yup.AnySchema>(Yup[type], name, function (arg: unknown, errorMessage: string) {
			return this.test({
				name,
				message: errorMessage,
				test: (value, testContext) => {
					if (!yupId) return fn(value, arg, testContext);

					// from typing is only added in v1.0.0-beta.7 (https://github.com/jquense/yup/issues/1631)
					// TODO: switch from dynamic reference once yup is updated
					const metaYupId = testContext.options["from"][0].schema.describe().meta.yupId;
					return customValidationMapping[metaYupId]?.[name]?.(value, arg, testContext);
				},
			});
		});
	};
}
