import { Breakpoint } from "@lifesg/react-design-system";
import { useMemo } from "react";
import { useTheme } from "styled-components";

export namespace WindowHelper {
	export const useMobileView = () => {
		const theme = useTheme();

		const isMobileView = useMemo(() => {
			return () =>
				window.innerWidth <= Breakpoint["md-min"]({ theme }) ||
				(window.innerWidth > window.innerHeight && window.innerHeight < Breakpoint["md-min"]({ theme }));
		}, [theme]);

		return isMobileView;
	};
}
