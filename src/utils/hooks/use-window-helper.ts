import { Breakpoint } from "@lifesg/react-design-system/theme";
import { useCallback, useContext } from "react";
import { ThemeContext } from "styled-components";

export const useWindowHelper = () => {
	const theme = useContext(ThemeContext);

	const isMobileView = useCallback(() => {
		return (
			window.innerWidth <= Breakpoint["sm-max"]({ theme }) ||
			(window.innerWidth > window.innerHeight && window.innerHeight < Breakpoint["sm-max"]({ theme }))
		);
	}, [theme]);

	return isMobileView;
};
