import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { TFormYupConfig } from "./types";
import { TWarningPayload } from "../../components/frontend-engine";

interface IYupContext {
	formValidationConfig: TFormYupConfig;
	setFormValidationConfig: Dispatch<SetStateAction<TFormYupConfig>>;
	warnings: TWarningPayload;
	setWarnings: Dispatch<SetStateAction<TWarningPayload>>;
}

interface IProps {
	children: ReactElement;
}

export const YupContext = createContext<IYupContext>({
	formValidationConfig: null,
	setFormValidationConfig: () => null,
	warnings: null,
	setWarnings: () => null,
});

export const YupProvider = ({ children }: IProps) => {
	const [formValidationConfig, setFormValidationConfig] = useState<TFormYupConfig>();
	const [warnings, setWarnings] = useState<TWarningPayload>();
	const values = useMemo(
		() => ({ formValidationConfig, setFormValidationConfig, warnings, setWarnings }),
		[formValidationConfig, warnings]
	);

	return <YupContext.Provider value={values}>{children}</YupContext.Provider>;
};
