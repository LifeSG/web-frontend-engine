import { screen } from "@testing-library/react";
import { SUBMIT_BUTTON_NAME } from "./data";

export const getSubmitButton = () => {
	return screen.getByRole("button", { name: SUBMIT_BUTTON_NAME });
};
