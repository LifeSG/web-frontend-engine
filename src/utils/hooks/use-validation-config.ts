import { useContext } from "react";
import * as Yup from "yup";
import { IYupValidationRule, YupContext } from "../../components/frontend-engine/yup";

/**
 * Hook that interacts with the validation config
 */
export const useValidationConfig = () => {
	const { formValidationConfig, setFormValidationConfig } = useContext(YupContext);

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

	return { formValidationConfig, setFieldValidationConfig, removeFieldValidationConfig };
};
