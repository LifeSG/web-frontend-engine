import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { TFormYupConfig } from "./types";

interface IYupContext {
	formValidationConfig: TFormYupConfig;
	setFormValidationConfig: Dispatch<SetStateAction<TFormYupConfig>>;
}

interface IProps {
	children: ReactElement;
}

export const YupContext = createContext<IYupContext>({
	formValidationConfig: null,
	setFormValidationConfig: () => null,
});

export const YupProvider = ({ children }: IProps) => {
	const [formValidationConfig, setFormValidationConfig] = useState<TFormYupConfig>();
	const values = useMemo(() => ({ formValidationConfig, setFormValidationConfig }), [formValidationConfig]);

	return <YupContext.Provider value={values}>{children}</YupContext.Provider>;
};
