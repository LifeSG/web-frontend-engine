import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues } from "../../components/frontend-engine/types";
import { IYupValidationRule, YupContext, YupHelper } from "../../components/frontend-engine/yup";

/**
 * Hook that handles the generation of the validationSchema
 */
export const useValidationSchema = () => {
	const { formValidationConfig, setFormValidationConfig } = useContext(YupContext);
	const [hardValidationSchema, setHardValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();
	const [softValidationSchema, setSoftValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();
	const [warnings, setWarnings] = useState<Record<string, string>>({});

	useEffect(() => {
		if (formValidationConfig) {
			const { softSchema, hardSchema } = YupHelper.buildSchema(formValidationConfig);
			setHardValidationSchema(hardSchema);
			setSoftValidationSchema(softSchema);
		}
	}, [formValidationConfig]);

	/**
	 * Sets the validation config in the context provider by field id
	 * @param id field id
	 * @param schema Yup schema object, add your custom validation logic here
	 * @param validationRules array validation rules passed from JSON
	 */
	const setFieldValidationConfig = <V = IYupValidationRule>(
		id: string,
		schema: Yup.AnySchema,
		validationRules: V[] = [],
		allowSoftValidation?: boolean
	) => {
		setFormValidationConfig((oldConfig) => ({
			...oldConfig,
			[id]: { schema, validationRules, allowSoftValidation },
		}));
	};

	/**
	 * Remove field id from validation config to prevent unnecessary validations
	 * @param id field id
	 */
	const removeFieldValidationConfig = (id: string) =>
		setFormValidationConfig((oldConfig) => {
			const newConfig = { ...oldConfig };
			delete newConfig[id];
			return newConfig;
		});

	/**
	 * Executes validation based on allowSoftValidation flag provided in the schema to generate warning messages
	 * @param schema soft validation schema
	 * @param data user input data
	 */
	const performSoftValidation = (schema: Yup.ObjectSchema<ObjectShape>, data: TFrontendEngineValues<any>): void => {
		try {
			schema.validateSync(data, { abortEarly: false });
		} catch (error) {
			const validationError = error as Yup.ValidationError;

			validationError.inner.forEach((field) => {
				setWarnings((prev) => ({
					...prev,
					[field.path]: field.message,
				}));
			});
		}
	};

	return {
		warnings,
		softValidationSchema,
		hardValidationSchema,
		formValidationConfig,
		performSoftValidation,
		setFieldValidationConfig,
		removeFieldValidationConfig,
	};
};
