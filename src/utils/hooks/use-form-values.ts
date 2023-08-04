import { useContext } from "react";
import { FormValuesContext } from "../../components/frontend-engine/form-values";

export const useFormValues = () => {
	const { setFormValues, formValues, formValuesRef, setFieldHistory, fieldHistory } = useContext(FormValuesContext);

	const getField = (id: string) => {
		return formValuesRef.current[id];
	};

	const setField = (id: string, value: unknown) => {
		setFormValues((formValues) => {
			const newState = {
				...formValues,
				[id]: value,
			};
			formValuesRef.current = newState;
			return newState;
		});
	};

	const setFields = (values: Record<string, unknown>) => {
		setFormValues((formValues) => {
			const newState = {
				...formValues,
				...values,
			};
			formValuesRef.current = newState;
			return newState;
		});
	};

	const resetFields = (values: Record<string, unknown>) => {
		const newState = { ...values };
		formValuesRef.current = newState;
		setFormValues(newState);
	};

	const isFieldShown = (id: string): boolean => {
		return !!fieldHistory[id];
	};

	const setFieldShown = (id: string) => {
		setFieldHistory((state) => {
			return {
				...state,
				[id]: true,
			};
		});
	};

	return { formValues, getField, setFields, setField, resetFields, fieldHistory, isFieldShown, setFieldShown };
};
