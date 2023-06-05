import { MediaWidths } from "@lifesg/react-design-system/media";

export namespace WindowHelper {
	export const isMobileView = (): boolean => {
		return (
			window.innerWidth <= MediaWidths.mobileL ||
			(window.innerWidth > window.innerHeight && window.innerHeight < MediaWidths.mobileL)
		);
	};
}
