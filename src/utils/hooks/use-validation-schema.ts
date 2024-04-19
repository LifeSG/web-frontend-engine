import isEmpty from "lodash/isEmpty";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues, TWarningPayload } from "../../components/frontend-engine/types";
import { IFieldYupConfig, TFormYupConfig, YupContext, YupHelper } from "../../context-providers";
import { ObjectHelper } from "../object-helper";

/**
 * Hook that handles the generation of the validationSchema
 */
export const useValidationSchema = () => {
	const { formValidationConfig, warnings, setWarnings, yupId } = useContext(YupContext);
	const [hardValidationSchema, setHardValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>(Yup.object());
	const [softValidationSchema, setSoftValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>(Yup.object());

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

				const softValidationRules = value.validationRules.filter(({ soft }) => soft);
				const hardValidationRules = value.validationRules.filter(({ soft }) => !soft);
				if (softValidationRules.length) {
					softValidationConfig = ObjectHelper.upsert<IFieldYupConfig>(softValidationConfig, key, {
						schema: value.schema,
						validationRules: softValidationRules,
					});
				}
				if (hardValidationRules.length) {
					hardValidationConfig = ObjectHelper.upsert<IFieldYupConfig>(hardValidationConfig, key, {
						schema: value.schema,
						validationRules: hardValidationRules,
					});
				}
			});

			setSoftValidationSchema(YupHelper.buildSchema(softValidationConfig, yupId));
			setHardValidationSchema(YupHelper.buildSchema(hardValidationConfig, yupId));
		}
	}, [formValidationConfig, yupId]);

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

	const addWarnings = (warningPayload: TWarningPayload) => {
		setWarnings({ ...warnings, ...warningPayload });
	};

	return {
		warnings,
		softValidationSchema,
		hardValidationSchema,
		performSoftValidation,
		addWarnings,
		yupId,
	};
};
