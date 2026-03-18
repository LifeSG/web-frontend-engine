import { useContext } from "react";
import { RecaptchaContext } from "./recaptcha-provider";

export const useRecaptcha = () => {
	const { recaptchaState, getToken } = useContext(RecaptchaContext);
	return {
		loaded: recaptchaState.loaded,
		getToken,
	};
};
