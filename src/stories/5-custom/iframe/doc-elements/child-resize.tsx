import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import { useEffect } from "react";
import { EPostMessageEvent } from "../../../../components/custom";

export const ChildResize = () => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const host = `${window.location.protocol}//${window.location.host}`;
	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		window.parent.postMessage({ type: EPostMessageEvent.TRIGGER_SYNC }, host);
	}, []);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
	const handleClick = () => {
		window.parent.postMessage(
			{ type: EPostMessageEvent.RESIZE, payload: { height: document.body.clientHeight } },
			"*"
		);
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<>
			<Button.Default onClick={handleClick}>Resize iframe</Button.Default>
			<br />
			<Typography.BodyBL>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
				dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
				ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
				fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
				deserunt mollit anim id est laborum.
			</Typography.BodyBL>
		</>
	);
};
