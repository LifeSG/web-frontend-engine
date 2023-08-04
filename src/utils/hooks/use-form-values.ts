import { useContext } from "react";
import { FormValuesContext } from "../../components/frontend-engine/form-values";

export const useFormValues = () => {
	const { setFormValues, formValues, formValuesRef } = useContext(FormValuesContext);

	const getField = (id: string) => {
		return formValuesRef.current[id];
	};

	const setField = (id: string, value: unknown) => {
		formValuesRef.current[id] = value;
		setFormValues((state) => {
			const newState = {
				...state,
				[id]: value,
			};
			return newState;
		});
	};

	const setFields = (values: Record<string, unknown>) => {
		formValuesRef.current = { ...formValuesRef.current, ...values };
		setFormValues((state) => {
			const newState = {
				...state,
				...values,
			};
			return newState;
		});
	};

	const resetFields = (values: Record<string, unknown>) => {
		const newState = { ...values };
		formValuesRef.current = newState;
		setFormValues(newState);
	};

	return { formValues, getField, setFields, setField, resetFields };
};
