import { Dispatch, ReactElement, SetStateAction, createContext, useState } from "react";

interface IFormValuesContext {
	formValues: Record<string, unknown>;
	setFormValues: Dispatch<SetStateAction<Record<string, unknown>>>;
}

interface IProps {
	children: ReactElement;
}

export const FormValuesContext = createContext<IFormValuesContext>({
	formValues: null,
	setFormValues: null,
});

export const FormValuesProvider = ({ children }: IProps) => {
	const [formValues, setFormValues] = useState<Record<string, unknown>>({});

	return <FormValuesContext.Provider value={{ formValues, setFormValues }}>{children}</FormValuesContext.Provider>;
};
