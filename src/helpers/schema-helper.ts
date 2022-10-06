import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	FieldType,
	IFrontendEngineData,
	IFrontendEngineValidator,
	TFrontendEngineFieldSchema,
	TFrontendEngineValidationSchema,
	TValidationCondition,
	TValidationRule,
	TValidationType,
	VALIDATION_CONDITIONS,
	VALIDATION_TYPES,
} from "../components/frontend-engine/types";

export namespace SchemaHelper {
	/**
	 * Creates a yupSchema that will be used to validate against inputs in FrontendEngine
	 *
	 * @param data - An array of fields specified by the user with its corresponding validations
	 * @param validators - An array of custom validators
	 * @returns yupSchema to be applied in the engine
	 */
	export const buildValidationFromJson = (
		data: IFrontendEngineData,
		validators?: IFrontendEngineValidator[]
	): Yup.ObjectSchema<ObjectShape> => {
		if (!data) {
			return Yup.object().shape({});
		}

		// TODO: Find out where custom validator rules are applied
		// if (validators) {
		// 	addCustomValidatorRules(validators);
		// }

		const yupSchema: ObjectShape = buildYupSchema(data.fields);
		console.log("SCHEMA --> ", yupSchema);

		return Yup.object().shape(yupSchema);
	};

	const buildYupSchema = (fields: TFrontendEngineFieldSchema[]): ObjectShape => {
		const yupSchema: ObjectShape = {};

		fields.forEach((field) => {
			// NOTE: Validation is optional field
			const { id, type, validation } = field;

			const hasCustomValidationType = validation
				? validation.some((v: TFrontendEngineValidationSchema) => VALIDATION_TYPES.includes(v))
				: false;
			const defaultValidationRules: TFrontendEngineValidationSchema[] = !hasCustomValidationType
				? buildDefaultValidationRule(type)
				: [];

			// NOTE: Babel cannot compile spread operators for storybook to render
			// yupSchema[id] = buildFieldYupSchema([...defaultValidationRules, ...validation]);
			yupSchema[id] = buildFieldYupSchema(defaultValidationRules.concat(validation || []));
		});

		return yupSchema;
	};

	/**
	 * Creates a yupSchema for a given field
	 *
	 * @param validations - List of validations specified by the user on a given field
	 * @returns yupSchema corresponding to the specified validations and constraints
	 */
	const buildFieldYupSchema = (validations: TFrontendEngineValidationSchema[]): Yup.AnySchema => {
		let yupSchema = {} as Yup.AnySchema;
		const validationRules = validations.map((validation) => formatValidationRule(validation));
		const validationType = validationRules.filter((v) =>
			VALIDATION_TYPES.includes(Object.keys(v)[0] as TValidationType)
		);

		// TODO: Remove logging
		if (!validationType.length) {
			console.warn(`Does not provide such validation option - ${validationType}`);
		} else if (validationType.length > 1) {
			console.warn("Multiple validation types for this rule are provided");
		}

		yupSchema = mapYupSchema(validationType[0]);

		const validationConditions = validationRules.filter((v) =>
			VALIDATION_CONDITIONS.includes(Object.keys(v)[0] as TValidationCondition)
		);
		yupSchema = mapYupConditions(yupSchema, validationConditions);

		return yupSchema;
	};

	/**
	 * Enforces a consistent validation structure of { rule: [value] }
	 *
	 * @param rule - The validation type specified by the user
	 * @returns A formatted structure of { rule: [value] }
	 */
	const formatValidationRule = (rule: TFrontendEngineValidationSchema): TValidationRule => {
		let formattedRule: TValidationRule = {};
		const isRuleString = typeof rule === "string";
		const isRuleObject = typeof rule === "object";

		if (isRuleString) {
			formattedRule = { [rule]: {} };
		} else if (isRuleObject) {
			Object.keys(rule).forEach((key) => {
				formattedRule[key] = rule[key];
			});
		}

		return formattedRule;
	};

	/**
	 * Creates a Yup schema for a given field
	 *
	 * @param validationRule - The validation type specified by user (i.e. string)
	 * @returns yupSchema that corresponds to the validation type
	 */
	const mapYupSchema = (validationRule: TValidationRule): Yup.AnySchema => {
		const validationRuleData = Object.entries(validationRule)[0];
		const validationRuleKey = validationRuleData[0] as TValidationType;
		const validationRuleValue = validationRuleData[1] ?? null;

		switch (validationRuleKey) {
			case "string":
				return Yup.string().typeError(validationRuleValue.message || "Only string values are allowed");
			case "number":
				return Yup.number().typeError(validationRuleValue.message || "Only number values are allowed");
			case "boolean":
				return Yup.boolean().typeError(validationRuleValue.message || "Only boolean values are allowed");
			case "array":
				return Yup.array().typeError(validationRuleValue.message || "Only array values are allowed");
			case "object":
				return Yup.object().typeError(validationRuleValue.message || "Only object values are allowed");
			default:
				return Yup.mixed();
		}
	};

	/**
	 * Adds Yup validation and constraints based on specified rules
	 *
	 * @param yupSchema - Yup schema that was previously created from specified validation type
	 * @param validationRules - An array of validation rules to be mapped against validation type
	 * 								(i.e. a string schema might contain { maxLength: 255 })
	 * @returns yupSchema with added constraints and validations
	 */
	const mapYupConditions = (yupSchema: Yup.AnySchema, validationRules: TValidationRule[]): Yup.AnySchema => {
		validationRules.forEach((rule) => {
			const validationRuleData = Object.entries(rule)[0];
			const validationRuleKey = validationRuleData[0] as TValidationCondition;
			const validationRuleValue = validationRuleData[1];

			switch (validationRuleKey) {
				case "maxLength":
					yupSchema = (yupSchema as Yup.StringSchema).max(
						validationRuleValue.value,
						validationRuleValue.message || `Must be less than ${validationRuleValue.value} characters`
					);
					break;
				case "required":
					yupSchema = yupSchema.required(validationRuleValue.message || "This field is required");
					break;
				default:
					break;
			}
		});

		return yupSchema;
	};

	/**
	 * Builds default rules for users that miss out certain behaviourial functions
	 * (i.e. Contact field must only contain numbers)
	 *
	 * @param type - Name of field component supported by FrontendEngine
	 * @returns Array of default validations for the field component
	 */
	const buildDefaultValidationRule = (type: string): TFrontendEngineValidationSchema[] => {
		const args: TFrontendEngineValidationSchema[] = [];
		const fieldType = FieldType[type as keyof typeof FieldType];

		switch (fieldType) {
			// TODO: Add validation against symbols
			case String(FieldType.TEXTAREA):
				args.push("string");
				break;
			default:
				// TODO: Add default validation rules
				break;
		}

		return args;
	};

	// const addCustomValidatorRules = (validators: IFrontendEngineValidator[]): void => {
	// 	validators.forEach((validator) => {
	// 		Yup.addMethod(Yup.mixed, validator.ruleName, function (errorMessage: string) {
	// 			return this.test({
	// 				name: validator.ruleName,
	// 				message: errorMessage || validator.errorMessage,
	// 				test: function (value) {
	// 					return value === undefined || validator.validate(value);
	// 				},
	// 			});
	// 		});
	// 	});
	// };
}
