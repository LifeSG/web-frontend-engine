import { screen } from "@testing-library/react";
import { TFrontendEngineFieldSchema } from "../../components/frontend-engine";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, SUBMIT_BUTTON_LABEL } from "./data";

type TAriaRoles = "textbox" | "generic" | "button" | "spinbutton" | "radio" | "list";

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

export const getField = (role: TAriaRoles, label?: string, isQuery = false): HTMLElement => {
	// NOTE: Query does not throw an error if not exist
	if (isQuery) {
		return screen.queryByRole(role, label && { name: label });
	}
	return screen.getByRole(role, label && { name: label });
};

export const getErrorMessage = (isQuery = false): HTMLElement => {
	if (isQuery) {
		return screen.queryByText(ERROR_MESSAGE);
	}
	return screen.getByText(ERROR_MESSAGE);
};
