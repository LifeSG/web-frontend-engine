import { Dispatch, ReactElement, SetStateAction, createContext, useState } from "react";

interface IFrontendEngineFormContext {
	submitHandler: () => void;
	setSubmitHandler: Dispatch<SetStateAction<() => void>>;
	wrapInForm: boolean;
	setWrapInForm: Dispatch<SetStateAction<boolean>>;
}

interface IProps {
	children: ReactElement;
}

export const FrontendEngineFormContext = createContext<IFrontendEngineFormContext>({
	submitHandler: null,
	setSubmitHandler: null,
	wrapInForm: true,
	setWrapInForm: null,
});

export const FrontendEngineFormProvider = ({ children }: IProps) => {
	const [submitHandler, setSubmitHandler] = useState<() => void>(null);
	const [wrapInForm, setWrapInForm] = useState(true);

	return (
		<FrontendEngineFormContext.Provider value={{ submitHandler, setSubmitHandler, wrapInForm, setWrapInForm }}>
			{children}
		</FrontendEngineFormContext.Provider>
	);
};
