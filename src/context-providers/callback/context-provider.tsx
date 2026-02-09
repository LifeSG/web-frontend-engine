import { createContext, ReactNode, useMemo } from "react";

/**
 * External callbacks that can be passed from parent application
 */
export interface ICallback {
	(...args: any[]): any | undefined;
}

export interface ICallbacks {
	[key: string]: ICallback;
}

/**
 * Context for external callbacks passed from parent application
 */
export interface ICallbacksContext {
	callbacks?: ICallbacks;
}

interface ICallbacksProviderProps {
	children: ReactNode;
	callbacks?: ICallbacks;
}

export const CallbacksContext = createContext<ICallbacksContext>({
	callbacks: undefined,
});

export const CallbacksProvider = ({ children, callbacks }: ICallbacksProviderProps) => {
	const value = useMemo(() => ({ callbacks }), [callbacks]);
	return <CallbacksContext.Provider value={value}>{children}</CallbacksContext.Provider>;
};
