import { useContext } from "react";
import { FormValuesContext } from "../../components/frontend-engine/form-values";

export const useFormValues = () => {
	const { setFormValues, formValues } = useContext(FormValuesContext);

	const setField = (id: string, value: unknown) => {
		setFormValues((formValues) => ({
			...formValues,
			[id]: value,
		}));
	};

	const setFields = (values: Record<string, unknown>) => {
		setFormValues((formValues) => ({
			...formValues,
			...values,
		}));
	};

	const resetFields = (values: Record<string, unknown>) => {
		setFormValues({ ...values });
	};

	return { formValues, setFields, setField, resetFields };
};
