import { useCallback, useContext } from "react";
import { CustomComponentsContext } from "../../context-providers";

export const useCustomComponents = () => {
	const { customComponents, setCustomComponents } = useContext(CustomComponentsContext);

	const getCustomComponent = useCallback(
		(referenceKey: string) => {
			return customComponents?.[referenceKey];
		},
		[customComponents]
	);

	return { customComponents, getCustomComponent, setCustomComponents };
};
