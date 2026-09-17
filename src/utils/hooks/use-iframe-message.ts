import { useEffect } from "react";

type MessageHandler<T = any> = (event: MessageEvent<{ payload: T }>) => void;

export const useIframeMessage = <T>(eventType: string, handler: MessageHandler<T>, allowedOrigin?: string | null) => {
	useEffect(() => {
		const eventHandler = (event: MessageEvent) => {
			// undefined = caller didn't request an origin check at all (unchanged, pre-existing behavior).
			// null = caller required an origin check but couldn't establish one (e.g. an unparseable iframe
			// src) — fail closed and reject every message, not fail open and accept every message.
			// event.origin is always a real string set by the browser, so it can never equal null itself.
			if (allowedOrigin !== undefined && event.origin !== allowedOrigin) return;
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
	}, [eventType, handler, allowedOrigin]);
};
