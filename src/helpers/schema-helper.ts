import { isEqual } from "lodash";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import {
	FieldType,
	IFrontendEngineData,
	IFrontendEngineValidator,
	TFrontendEngineFieldSchema,
	TFrontendEngineValidationCondition,
	TFrontendEngineValidationSchema,
	TFrontendEngineValidationType,
	VALIDATION_TYPES,
} from "../components/frontend-engine/types";

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
		console.log("SCHEMA --> ", yupSchema);

		return Yup.object().shape(yupSchema);
	};

	const buildYupSchema = (fields: TFrontendEngineFieldSchema[]): ObjectShape => {
		const yupSchema: ObjectShape = {};

		fields.forEach((field) => {
			// NOTE: Validation is optional field
			const { id, type, validation } = field;

			const hasCustomValidationType = validation
				? validation.some((v: any): v is TFrontendEngineValidationType => VALIDATION_TYPES.includes(v))
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

	const buildFieldYupSchema = (validations: TFrontendEngineValidationSchema[]): Yup.AnySchema => {
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

		yupSchema = mapYupSchema(validationTypes[0]);

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
			// TODO: To clarify the purpose of this schema -> { "string": { some info here } }
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

	const mapYupSchema = (validationType: Record<string, any>): Yup.AnySchema => {
		const validationKey = Object.keys(validationType)[0] as TFrontendEngineValidationSchema;

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
