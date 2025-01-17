import { useEffect } from "react";

type MessageHandler<T = any> = (event: MessageEvent<{ payload: T }>) => void;

export const useIframeMessage = <T>(eventType: string, handler: MessageHandler<T>) => {
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
