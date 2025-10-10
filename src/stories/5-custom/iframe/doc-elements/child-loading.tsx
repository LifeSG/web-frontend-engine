import { useEffect } from "react";
import { EPostMessageEvent } from "../../../../components/custom";

export const ChildLoading = () => {
	const host = `${window.location.protocol}//${window.location.host}`;

	// Simulate some work and notify parent when ready
	useEffect(() => {
		const timer = setTimeout(() => {
			window.parent.postMessage({ type: EPostMessageEvent.LOADED }, host);
		}, 500);

		return () => clearTimeout(timer);
	}, [host]);

	return (
		<>
			Loading modal triggered via <code>Loading</code> event, dismissed via <code>Loaded</code> event.
		</>
	);
};
