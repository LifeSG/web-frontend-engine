import { Breakpoint } from "@lifesg/react-design-system";
import { useCallback } from "react";
import { useTheme } from "styled-components";

export const useWindowHelper = () => {
	const theme = useTheme();

	const isMobileView = useCallback(() => {
		return (
			window.innerWidth <= Breakpoint["md-min"]({ theme }) ||
			(window.innerWidth > window.innerHeight && window.innerHeight < Breakpoint["md-min"]({ theme }))
		);
	}, [theme]);

	return isMobileView;
};
