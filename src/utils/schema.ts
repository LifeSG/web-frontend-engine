import { isEqual } from "lodash";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	FieldType,
	IFrontendEngineData,
	IFrontendEngineFieldSchema,
	IFrontendEngineValidator,
	TFrontendEngineValidationCondition,
	TFrontendEngineValidationOption,
	TFrontendEngineValidationSchema,
	TFrontendEngineValidationType,
	VALIDATION_TYPES,
} from "../types";

export namespace SchemaHelper {
	export const buildValidationFromJson = (
		data: IFrontendEngineData,
		validators?: IFrontendEngineValidator[]
	): Yup.ObjectSchema<ObjectShape> => {
		if (!data) {
			return Yup.object().shape({});
		}

		// TODO: Find out where custom validator rules are applied
		if (validators) {
			addCustomValidatorRules(validators);
		}

		const yupSchema: ObjectShape = buildYupSchema(data.fields);
		console.log("schaaaema", yupSchema);
		return Yup.object().shape(yupSchema);
	};

	const buildYupSchema = (fields: IFrontendEngineFieldSchema[]): ObjectShape => {
		const yupSchema: ObjectShape = {};

		fields.forEach((field) => {
			const { id, type, title, validation } = field;
			const hasCustomValidationType = validation.some((v: any): v is TFrontendEngineValidationType =>
				VALIDATION_TYPES.includes(v)
			);
			const defaultValidationRules = !hasCustomValidationType ? buildDefaultValidationRule(type) : [];

			yupSchema[id] = buildCustomYupSchema([...defaultValidationRules, ...validation]);
		});

		return yupSchema;
	};

	const buildCustomYupSchema = (validations: TFrontendEngineValidationSchema[]): Yup.AnySchema => {
		let yupSchema = {} as Yup.AnySchema;

		const validationRules = validations.map((validation) => formatValidationRule(validation));
		const validationTypes = validationRules.filter((rule) => {
			const key = Object.keys(rule)[0] as TFrontendEngineValidationType;

			return VALIDATION_TYPES.includes(key);
		});

		// TODO: Remove logging
		if (!validationTypes.length) {
			console.warn(`Does not provide such validation option - ${validationRules}`);
		} else if (validationTypes.length > 1) {
			console.warn("Multiple validation types for this rule are provided");
		}

		yupSchema = mapYupSchema(validationTypes);

		const validationConditions = validationRules.filter((rule) => !isEqual(rule, validationTypes[0]));

		yupSchema = mapYupConditions(yupSchema, validationConditions);

		return yupSchema;
	};

	// Returns a consistent validation structure of { rule: [value] }
	const formatValidationRule = (rule: TFrontendEngineValidationSchema): Record<string, any> => {
		let formattedRule: Record<string, any> = {};
		const isRuleString = typeof rule === "string";
		const isRuleObject = typeof rule === "object";

		if (isRuleString) {
			formattedRule = { [rule]: [] };
		} else if (rule && isRuleObject) {
			Object.keys(rule).forEach((key) => {
				const validationOption = key as keyof typeof rule;
				const isRuleString = typeof rule[validationOption] === "string";
				// TODO: Might be a redundant check
				const isRuleArray = Array.isArray(rule[validationOption]);

				if (isRuleString && !isRuleArray) {
					formattedRule[key] = [rule[validationOption]];
				} else {
					formattedRule[key] = rule[validationOption];
				}
			});
		} else {
			formattedRule = rule;
		}

		return formattedRule;
	};

	const mapYupSchema = (validationRules: Record<string, any>[]): Yup.AnySchema => {
		const validationRule = validationRules[0];
		const validationKey = Object.keys(validationRule)[0] as TFrontendEngineValidationOption;

		switch (validationKey) {
			case "string":
				return Yup.string();
			case "number":
				return Yup.number().typeError("Only numbers are allowed");
			case "boolean":
				return Yup.boolean();
			case "array":
				return Yup.array();
			case "object":
				return Yup.object();
			default:
				return Yup.mixed();
		}
	};

	const mapYupConditions = (yupSchema: Yup.AnySchema, validationConditions: Record<string, any>[]): Yup.AnySchema => {
		validationConditions.forEach((condition) => {
			const key = Object.keys(condition)[0] as TFrontendEngineValidationCondition;

			switch (key) {
				case "required":
					if (condition.required.length) {
						yupSchema = yupSchema.required(condition.required);
					} else {
						yupSchema = yupSchema.required("This field is required");
					}
					break;
				default:
					console.warn(
						"Something went wrong in buildingCustomYupSchema - Found condition but rule not applied"
					);
					break;
			}
		});

		return yupSchema;
	};

	// Builds default rules for users that miss out certain behaviourial functions (i.e. Contact field must only contain numbers)
	const buildDefaultValidationRule = (type: string): TFrontendEngineValidationType[] => {
		const args: TFrontendEngineValidationType[] = [];
		const typeValue = FieldType[type as keyof typeof FieldType];

		switch (typeValue) {
			case String(FieldType.TEXTAREA):
				args.push("string");
				break;
			default:
				// TODO: Add default validation rules
				break;
		}

		return args;
	};

	const addCustomValidatorRules = (validators: IFrontendEngineValidator[]): void => {
		validators.forEach((validator) => {
			Yup.addMethod(Yup.mixed, validator.ruleName, function (errorMessage: string) {
				return this.test({
					name: validator.ruleName,
					message: errorMessage || validator.errorMessage,
					test: function (value) {
						return value === undefined || validator.validate(value);
					},
				});
			});
		});
	};
}
