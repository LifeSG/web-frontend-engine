import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { TFormYupConfig } from "./types";
import { TWarningPayload } from "../../components/frontend-engine";
import { generateRandomId } from "../../utils";

interface IYupContext {
	formValidationConfig: TFormYupConfig;
	setFormValidationConfig: Dispatch<SetStateAction<TFormYupConfig>>;
	warnings: TWarningPayload;
	setWarnings: Dispatch<SetStateAction<TWarningPayload>>;
	yupId: string;
}

interface IProps {
	children: ReactElement;
}

export const YupContext = createContext<IYupContext>({
	formValidationConfig: null,
	setFormValidationConfig: () => null,
	warnings: null,
	setWarnings: () => null,
	yupId: null,
});

export const YupProvider = ({ children }: IProps) => {
	const [formValidationConfig, setFormValidationConfig] = useState<TFormYupConfig>();
	const [warnings, setWarnings] = useState<TWarningPayload>();
	const [yupId] = useState(generateRandomId());
	const values = useMemo(
		() => ({ formValidationConfig, setFormValidationConfig, warnings, setWarnings, yupId }),
		[formValidationConfig, warnings, yupId]
	);

	return <YupContext.Provider value={values}>{children}</YupContext.Provider>;
};
