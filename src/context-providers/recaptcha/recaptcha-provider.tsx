import { createContext, useEffect, useReducer } from "react";
import { IRecaptchaContext, IRecaptchaState, TRecaptchaActions } from "./types";

// =============================================================================
// DEFAULT VALUES
// =============================================================================
const DEFAULT_STATE: IRecaptchaState = {
	loaded: false,
};

const DEFAULT_CONTEXT_VALUES: IRecaptchaContext = {
	dispatch: () => undefined,
	recaptchaState: DEFAULT_STATE,
	getToken: async () => undefined,
};

// =============================================================================
// CONTEXT
// =============================================================================
export const RecaptchaContext = createContext<IRecaptchaContext>(DEFAULT_CONTEXT_VALUES);

// =============================================================================
// REDUCER
// =============================================================================
export const recaptchaStateReducer = (state: IRecaptchaState, action: TRecaptchaActions): IRecaptchaState => {
	switch (action.type) {
		case "set-recaptcha-loaded":
			return { ...state, loaded: true };
		default:
			return state;
	}
};

interface IRecaptchaProviderProps {
	children: React.ReactNode;
	/** reCAPTCHA v3 Enterprise site key. When omitted the provider is a no-op. */
	recaptchaSiteKey?: string | undefined;
}

// =============================================================================
// CONTEXT PROVIDER
// =============================================================================
export const RecaptchaProvider = ({ children, recaptchaSiteKey }: IRecaptchaProviderProps) => {
	const [recaptchaState, dispatch] = useReducer(recaptchaStateReducer, DEFAULT_STATE);
	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		if (!recaptchaSiteKey) return;
		// Script already evaluated — mark as loaded immediately
		if (window.grecaptcha?.enterprise) {
			dispatch({ type: "set-recaptcha-loaded" });
			return;
		}

		// Script tag already injected by a previous mount
		const existing = document.querySelector<HTMLScriptElement>('script[src*="recaptcha/enterprise.js"]');
		if (existing) {
			// Script may have already loaded by the time we remount — check again before attaching listener
			if (window.grecaptcha?.enterprise) {
				dispatch({ type: "set-recaptcha-loaded" });
			} else {
				existing.addEventListener("load", () => dispatch({ type: "set-recaptcha-loaded" }));
			}
			return;
		}

		// First mount — inject the script
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`;
		script.onload = () => dispatch({ type: "set-recaptcha-loaded" });
		document.head.appendChild(script);
	}, [recaptchaSiteKey]);

	// =========================================================================
	// HELPERS
	// =========================================================================
	/**
	 * Executes a reCAPTCHA v3 Enterprise challenge and returns the token.
	 * Returns `undefined` when no site key is configured or the script has not
	 * loaded yet.
	 */
	const getToken = (action: string): Promise<string | undefined> => {
		return new Promise((resolve) => {
			if (!recaptchaSiteKey || typeof window === "undefined" || !window.grecaptcha?.enterprise) {
				resolve(undefined);
				return;
			}
			window.grecaptcha.enterprise.ready(async () => {
				try {
					const token = await window.grecaptcha.enterprise.execute(recaptchaSiteKey, {
						action,
					});
					resolve(token);
				} catch {
					resolve(undefined);
				}
			});
		});
	};

	// =========================================================================
	// RENDER
	// =========================================================================
	return (
		<RecaptchaContext.Provider value={{ recaptchaState, dispatch, getToken }}>{children}</RecaptchaContext.Provider>
	);
};
