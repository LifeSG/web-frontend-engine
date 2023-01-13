import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { TFrontendEngineValues } from "../../components/frontend-engine/types";
import { YupContext, YupHelper } from "../../components/frontend-engine/yup";

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
			const { softSchema, hardSchema } = YupHelper.buildSchema(formValidationConfig);
			setHardValidationSchema(hardSchema);
			setSoftValidationSchema(softSchema);
		}
	}, [formValidationConfig]);

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
		performSoftValidation,
	};
};
