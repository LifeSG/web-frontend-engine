import { useEffect } from "react";

type MessageHandler = (event: MessageEvent) => void;
export const useIframeMessage = (eventType: string, handler: MessageHandler) => {
	useEffect(() => {
		const eventHandler = (event: MessageEvent) => {
			if (event.data.type === eventType) {
				handler(event);
			}
		};

		// Add the event listener for postMessage
		window.addEventListener("message", eventHandler);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener("message", eventHandler);
		};
	}, [eventType, handler]);
};
