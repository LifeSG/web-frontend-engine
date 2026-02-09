import { useContext } from "react";
import { CallbacksContext } from "../../context-providers";

export const useCallbacks = () => {
	const context = useContext(CallbacksContext);

	if (!context) {
		throw new Error("useCallbacks must be used within CallbacksProvider");
	}

	return context;
};
