import { Breakpoint } from "@lifesg/react-design-system/theme";
import { useCallback } from "react";
import { useTheme } from "styled-components";

export const useWindowHelper = () => {
	const theme = useTheme();

	const isMobileView = useCallback(() => {
		return (
			window.innerWidth <= Breakpoint["sm-max"]({ theme }) ||
			(window.innerWidth > window.innerHeight && window.innerHeight < Breakpoint["sm-max"]({ theme }))
		);
	}, [theme]);

	return isMobileView;
};
