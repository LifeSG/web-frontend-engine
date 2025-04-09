import { Breakpoint } from "@lifesg/react-design-system";
import { ThemeSpec } from "@lifesg/react-design-system/theme/types";

export namespace WindowHelper {
	export const isMobileView = (theme?: ThemeSpec): boolean => {
		return (
			window.innerWidth <= Breakpoint["md-min"]({ theme }) ||
			(window.innerWidth > window.innerHeight && window.innerHeight < Breakpoint["md-min"]({ theme }))
		);
	};
}
