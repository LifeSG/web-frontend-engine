import isEmpty from "lodash/isEmpty";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues } from "../../components/frontend-engine/types";
import { IYupValidationRule, TFormYupConfig, YupContext, YupHelper } from "../../components/frontend-engine/yup";

/**
 * Hook that handles the generation of the validationSchema
 */
export const useValidationSchema = () => {
	const { formValidationConfig } = useContext(YupContext);
	const [hardValidationSchema, setHardValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();
	const [softValidationSchema, setSoftValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();
	const [warnings, setWarnings] = useState<Record<string, string>>({});

	useEffect(() => {
		if (formValidationConfig) {
			const hardValidationConfig: TFormYupConfig = {};
			const softValidationConfig: TFormYupConfig = {};

			Object.entries(formValidationConfig).forEach(([key, value]) => {
				if (!value.validationRules || value.validationRules.length === 0) {
					// NOTE: Fallback to default yup validators that's being set in component level
					upsertValidationConfig(hardValidationConfig, key, [], value.schema);
					return;
				}

				value.validationRules.forEach((rule) => {
					if (rule.soft) {
						upsertValidationConfig(softValidationConfig, key, rule, value.schema);
					} else {
						upsertValidationConfig(hardValidationConfig, key, rule, value.schema);
					}
				});
			});
			setSoftValidationSchema(YupHelper.buildSchema(softValidationConfig));
			setHardValidationSchema(YupHelper.buildSchema(hardValidationConfig));
		}
	}, [formValidationConfig]);

	/**
	 * Update if exists, else insert an entry in validation config
	 * @param config yup config passed by reference
	 * @param id unique field id
	 * @param rule validation rule
	 * @param schema yup schema
	 */
	const upsertValidationConfig = (
		config: TFormYupConfig,
		id: string,
		rule: IYupValidationRule,
		schema: Yup.AnySchema
	): void => {
		if (!(id in config)) {
			config[id] = { schema, validationRules: [rule] };
		} else {
			config[id]["validationRules"].push(rule);
		}
	};

	/**
	 * Executes validation based on allowSoftValidation flag provided in the schema to generate warning messages
	 * @param schema soft validation schema
	 * @param data user input data
	 */
	const performSoftValidation = (schema: Yup.ObjectSchema<ObjectShape>, data: TFrontendEngineValues<any>): void => {
		try {
			schema.validateSync(data, { abortEarly: false });
			setWarnings({});
		} catch (error) {
			const validationError = error as Yup.ValidationError;
			console.log(JSON.stringify(error));

			if (isEmpty(validationError)) {
				return;
			}
			const updatedWarnings = validationError.inner.reduce((acc, value) => {
				acc[value.path] = value.message;

				return acc;
			}, {});

			setWarnings(updatedWarnings);
		}
	};

	return {
		warnings,
		softValidationSchema,
		hardValidationSchema,
		performSoftValidation,
	};
};
