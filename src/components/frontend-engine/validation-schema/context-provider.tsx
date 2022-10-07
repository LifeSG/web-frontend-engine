import React, { createContext, Dispatch, ReactElement, SetStateAction, useMemo, useState } from "react";
import { TFormValidationConfig } from "./types";

interface IValidationContext {
	formValidationConfig: TFormValidationConfig;
	setFormValidationConfig: Dispatch<SetStateAction<TFormValidationConfig>>;
}

interface IProps {
	children: ReactElement;
}

export const ValidationContext = createContext<IValidationContext>({
	formValidationConfig: null,
	setFormValidationConfig: () => null,
});

export const ValidationProvider = ({ children }: IProps) => {
	const [formValidationConfig, setFormValidationConfig] = useState<TFormValidationConfig>();
	const values = useMemo(() => ({ formValidationConfig, setFormValidationConfig }), [formValidationConfig]);

	return <ValidationContext.Provider value={values}>{children}</ValidationContext.Provider>;
};
