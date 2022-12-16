import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { IYupValidationRule, YupContext, YupHelper } from "../../components/frontend-engine/yup";

/**
 * Hook that interacts with the validation schema context provider
 * use this hook to get/set the validationSchema and config
 */
export const useValidationSchema = () => {
	const { formValidationConfig, setFormValidationConfig } = useContext(YupContext);
	const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();

	useEffect(() => {
		if (formValidationConfig) {
			setValidationSchema(YupHelper.buildSchema(formValidationConfig));
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
		validationRules: V[] = []
	) => {
		setFormValidationConfig((oldConfig) => ({
			...oldConfig,
			[id]: { schema, validationRules },
		}));
	};

	const removeFieldValidationConfig = (id: string) =>
		setFormValidationConfig((oldConfig) => {
			const newConfig = { ...oldConfig };
			delete newConfig[id];
			return newConfig;
		});

	return { validationSchema, formValidationConfig, setFieldValidationConfig, removeFieldValidationConfig };
};
