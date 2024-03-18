import { useContext } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { FormValuesContext } from "../../context-providers";

export const useFormValues = (formMethods?: UseFormReturn | undefined) => {
	const formContext = useFormContext();
	const { setFormValues, formValues, formValuesRef, registeredFields, setRegisteredFields } =
		useContext(FormValuesContext);

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
		// ensure object references are different
		formValuesRef.current = { ...values };
		setFormValues(() => ({ ...values }));
	};

	/**
	 * Get form values
	 * @param payload specify the value(s) by field id(s) to return
	 * @param stripUnknown whether to exclude values of unregistered fields
	 */
	const getFormValues = (payload?: string | string[] | undefined, stripUnknown = false) => {
		if (typeof payload === "string") {
			if (!stripUnknown || (stripUnknown && registeredFields.includes(payload))) {
				return formMethods?.getValues(payload) || formContext?.getValues(payload);
			}
		} else if (Array.isArray(payload)) {
			if (!stripUnknown) {
				return formMethods?.getValues(payload) || formContext?.getValues(payload);
			} else {
				const registeredFieldIds = payload.filter((fieldId) => registeredFields.includes(fieldId));
				return formMethods?.getValues(registeredFieldIds) || formContext?.getValues(registeredFieldIds);
			}
		} else {
			const values = formMethods?.getValues() || formContext?.getValues();
			if (!stripUnknown) {
				return values;
			} else {
				const registeredFormValues = {};
				Object.entries(values).forEach(([key, value]) => {
					if (registeredFields.includes(key)) {
						registeredFormValues[key] = value;
					}
				});
				return registeredFormValues;
			}
		}
	};

	return {
		formValues,
		getField,
		setFields,
		setField,
		resetFields,
		registeredFields,
		setRegisteredFields,
		getFormValues,
	};
};
