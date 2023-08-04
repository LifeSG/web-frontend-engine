import { Dispatch, MutableRefObject, ReactElement, SetStateAction, createContext, useRef, useState } from "react";

interface IFormValuesContext {
	formValues: Record<string, unknown>;
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

export const FormValuesProvider = ({ children }: IProps) => {
	const [formValues, setFormValues] = useState<Record<string, unknown>>({});
	const formValuesRef = useRef<Record<string, unknown>>(formValues);

	return (
		<FormValuesContext.Provider value={{ formValues, setFormValues, formValuesRef }}>
			{children}
		</FormValuesContext.Provider>
	);
};
