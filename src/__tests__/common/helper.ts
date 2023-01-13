import { ByRoleOptions, screen } from "@testing-library/react";
import { TFrontendEngineFieldSchema } from "../../components/frontend-engine";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, SUBMIT_BUTTON_LABEL } from "./data";

type TAriaRoles = "textbox" | "generic" | "button" | "spinbutton" | "radio" | "list";

export const getSubmitButton = (): HTMLElement => {
	return screen.getByRole("button", { name: SUBMIT_BUTTON_LABEL });
};

export const getSubmitButtonProps = (): Record<string, TFrontendEngineFieldSchema> => {
	return {
		[SUBMIT_BUTTON_ID]: {
			label: SUBMIT_BUTTON_LABEL,
			fieldType: "submit",
		},
	};
};

export const getField = (
	role: TAriaRoles,
	nameOrConfig?: string | RegExp | ByRoleOptions,
	isQuery = false
): HTMLElement => {
	let options: ByRoleOptions = {};

	if (typeof nameOrConfig === "string" || nameOrConfig instanceof RegExp) {
		options = { name: nameOrConfig };
	} else {
		options = { ...nameOrConfig };
	}

	// NOTE: Query does not throw an error if not exist
	if (isQuery) {
		return screen.queryByRole(role, options);
	}
	return screen.getByRole(role, options);
};

export const getErrorMessage = (isQuery = false): HTMLElement => {
	if (isQuery) {
		return screen.queryByText(ERROR_MESSAGE);
	}
	return screen.getByText(ERROR_MESSAGE);
};

export const flushPromise = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));
