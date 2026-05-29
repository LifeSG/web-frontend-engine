import { ISubmitButtonSchema } from "../../components/fields";

export const SUBMIT_BUTTON_ID = "submit";
export const SUBMIT_BUTTON_LABEL = "Submit";
export const RESET_BUTTON_ID = "reset";
export const RESET_BUTTON_LABEL = "Reset";
export const ERROR_MESSAGE = "test error message";
export const FRONTEND_ENGINE_ID = "test";

export const SUBMIT_BUTTON_SCHEMA: Record<string, ISubmitButtonSchema> = {
	"submit-button": { uiType: "submit", label: "Submit" },
};
