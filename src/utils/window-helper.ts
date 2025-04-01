import { V2_MediaWidths } from "@lifesg/react-design-system/v2_media";

export namespace WindowHelper {
	export const isMobileView = (): boolean => {
		return (
			window.innerWidth <= V2_MediaWidths.mobileL ||
			(window.innerWidth > window.innerHeight && window.innerHeight < V2_MediaWidths.mobileL)
		);
	};
}
