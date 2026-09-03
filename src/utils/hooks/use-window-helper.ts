import { Breakpoint, parsePxOrRemValue, useDesignToken } from "@lifesg/react-design-system/theme";
import { useCallback } from "react";

export const useWindowHelper = () => {
	const smMaxToken = useDesignToken(Breakpoint["sm-max"]);
	const smMax = parsePxOrRemValue(smMaxToken ?? "");

	const isMobileView = useCallback(() => {
		return window.innerWidth <= smMax || (window.innerWidth > window.innerHeight && window.innerHeight < smMax);
	}, [smMax]);

	return isMobileView;
};
