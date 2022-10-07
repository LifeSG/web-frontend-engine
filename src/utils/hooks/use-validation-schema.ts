import { useContext, useEffect, useState } from "react";
import { ValidationContext } from "src/components/frontend-engine/validation-schema";
import { IValidationRule } from "src/components/frontend-engine/validation-schema/types";
import { ValidationSchemaUtils } from "src/components/frontend-engine/validation-schema/utils";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";

/**
 * Hook that interacts with the validation schema context provider
 * use this hook to get/set the validationSchema and config
 */
export const useValidationSchema = () => {
	const { formValidationConfig, setFormValidationConfig } = useContext(ValidationContext);
	const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();

	useEffect(() => {
		if (formValidationConfig) setValidationSchema(ValidationSchemaUtils.buildYupSchema(formValidationConfig));
	}, [formValidationConfig]);

	/**
	 * Sets the validation config in the context provider by field id
	 * @param id field id
	 * @param schema Yup schema object, add your custom validation logic here
	 * @param validationRules array validation rules passed from JSON
	 */
	const setFieldValidationConfig = (id: string, schema: Yup.AnySchema, validationRules: IValidationRule[]) => {
		setFormValidationConfig({
			...formValidationConfig,
			[id]: { schema, validationRules },
		});
	};

	return { validationSchema, formValidationConfig, setFieldValidationConfig };
};
