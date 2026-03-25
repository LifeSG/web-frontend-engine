import { Dispatch } from "react";

// =============================================================================
// CONTEXT
// =============================================================================
export interface IRecaptchaState {
	loaded: boolean;
}

export interface IRecaptchaContext {
	recaptchaState: IRecaptchaState;
	dispatch: Dispatch<TRecaptchaActions>;
	getToken: (action?: string) => Promise<string | undefined>;
}

// =============================================================================
// ACTIONS
// =============================================================================
export type TRecaptchaActions = ISetRecaptchaLoadedAction;

export interface ISetRecaptchaLoadedAction {
	type: "set-recaptcha-loaded";
}
