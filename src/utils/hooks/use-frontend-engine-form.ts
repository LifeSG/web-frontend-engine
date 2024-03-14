import { useContext } from "react";
import { FrontendEngineFormContext } from "../../context-providers";

export const useFrontendEngineForm = () => {
	const { submitHandler, setSubmitHandler, wrapInForm, setWrapInForm } = useContext(FrontendEngineFormContext);

	return {
		submitHandler,
		setSubmitHandler,
		wrapInForm,
		setWrapInForm,
	};
};
