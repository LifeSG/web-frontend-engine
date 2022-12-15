import { screen } from "@testing-library/react";
import { TFrontendEngineFieldSchema } from "../../components/frontend-engine";
import { SUBMIT_BUTTON_ID, SUBMIT_BUTTON_LABEL } from "./data";

export const getSubmitButton = (): HTMLElement => {
	return screen.getByRole("button", { name: SUBMIT_BUTTON_LABEL });
};

export const getSubmitButtonProps = (): Record<string, TFrontendEngineFieldSchema> => {
	return {
		[SUBMIT_BUTTON_ID]: {
			label: "Submit",
			fieldType: "submit",
		},
	};
};
