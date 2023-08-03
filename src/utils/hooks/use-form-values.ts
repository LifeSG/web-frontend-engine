import { useContext } from "react";
import { FormValuesContext } from "../../components/frontend-engine/form-values";

export const useFormValues = () => {
	const { setFormValues, formValues, setFieldHistory, fieldHistory } = useContext(FormValuesContext);

	const setField = (id: string, value: unknown) => {
		setFormValues((formValues) => {
			return {
				...formValues,
				[id]: value,
			};
		});
	};

	const setFields = (values: Record<string, unknown>) => {
		setFormValues((formValues) => {
			const res = {
				...formValues,
				...values,
			};
			return res;
		});
	};

	const resetFields = (values: Record<string, unknown>) => {
		setFormValues({ ...values });
	};

	const isFieldShown = (id: string): boolean => {
		return !!fieldHistory[id];
	};

	const setFieldShown = (id: string) => {
		setFieldHistory((fieldHistory) => {
			return {
				...fieldHistory,
				[id]: true,
			};
		});
	};

	return { formValues, setFields, setField, resetFields, fieldHistory, isFieldShown, setFieldShown };
};
