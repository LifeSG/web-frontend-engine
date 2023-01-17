import isEmpty from "lodash/isEmpty";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues } from "../../components/frontend-engine/types";
import { IFieldYupConfig, TFormYupConfig, YupContext, YupHelper } from "../../components/frontend-engine/yup";
import { ObjectHelper } from "../object-helper";

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
			let hardValidationConfig: TFormYupConfig = {};
			let softValidationConfig: TFormYupConfig = {};

			Object.entries(formValidationConfig).forEach(([key, value]) => {
				if (!value.validationRules || value.validationRules.length === 0) {
					// NOTE: Fallback to default yup validators that's being set in component level
					hardValidationConfig = ObjectHelper.upsert(hardValidationConfig, key, {
						schema: value.schema,
						validationRules: [],
					});
					return;
				}

				value.validationRules.forEach((rule) => {
					if (rule.soft) {
						softValidationConfig = ObjectHelper.upsert<IFieldYupConfig>(softValidationConfig, key, {
							schema: value.schema,
							validationRules: [rule],
						});
					} else {
						hardValidationConfig = ObjectHelper.upsert<IFieldYupConfig>(hardValidationConfig, key, {
							schema: value.schema,
							validationRules: [rule],
						});
					}
				});
			});
			setSoftValidationSchema(YupHelper.buildSchema(softValidationConfig));
			setHardValidationSchema(YupHelper.buildSchema(hardValidationConfig));
		}
	}, [formValidationConfig]);

	/**
	 * Executes validation based on allowSoftValidation flag provided in the schema to generate warning messages
	 * @param schema soft validation schema
	 * @param data user input data
	 */
	const performSoftValidation = (schema: Yup.ObjectSchema<ObjectShape>, data: TFrontendEngineValues): void => {
		try {
			schema.validateSync(data, { abortEarly: false });
			setWarnings({});
		} catch (error) {
			const validationError = error as Yup.ValidationError;

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
