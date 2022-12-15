import { Screen } from "@testing-library/react";
import { SUBMIT_BUTTON_NAME } from "./data";

export const getSubmitButton = (screen: Screen) => {
	return screen.getByRole("button", { name: SUBMIT_BUTTON_NAME });
};
