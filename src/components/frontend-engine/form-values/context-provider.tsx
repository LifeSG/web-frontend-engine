import { Dispatch, MutableRefObject, ReactElement, SetStateAction, createContext, useRef, useState } from "react";

interface IFormValuesContext {
	// form state mapping the field id to its value
	formValues: Record<string, unknown>;
	// allows access to the latest field values without having to wait for a rerender
	formValuesRef: MutableRefObject<Record<string, unknown>>;
	setFormValues: Dispatch<SetStateAction<Record<string, unknown>>>;
}

interface IProps {
	children: ReactElement;
}

export const FormValuesContext = createContext<IFormValuesContext>({
	formValues: null,
	formValuesRef: null,
	setFormValues: null,
});

/**
 * This context stores the form values in parallel to react-hook-form's state.
 *
 * The main difference is that it persists the values of fields that are currently conditionally hidden.
 * Otherwise we won't be able to get their previous values (as the fields are unregistered from react-hook-form).
 *
 * This is used to populate the values of conditionally rendered fields when they are shown again.
 *
 */
export const FormValuesProvider = ({ children }: IProps) => {
	const [formValues, setFormValues] = useState<Record<string, unknown>>({});
	const formValuesRef = useRef<Record<string, unknown>>(formValues);

	return (
		<FormValuesContext.Provider value={{ formValues, setFormValues, formValuesRef }}>
			{children}
		</FormValuesContext.Provider>
	);
};
