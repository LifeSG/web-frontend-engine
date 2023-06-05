import { useContext } from "react";
import { EventContext } from "../../components/frontend-engine/event";

/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */
export const useFieldEvent = () => {
	const { eventManagerRef } = useContext(EventContext);

	const addFieldEventListener = (
		type: string,
		id: string,
		listener: (ev: Event) => unknown,
		options?: boolean | AddEventListenerOptions
	) => {
		eventManagerRef.current?.addEventListener(`${id}:${type}`, listener, options);
	};

	const removeFieldEventListener = (
		type: string,
		id: string,
		listener: (ev: Event) => unknown,
		options?: boolean | EventListenerOptions
	) => {
		eventManagerRef.current?.removeEventListener(`${id}:${type}`, listener, options);
	};

	const dispatchFieldEvent = (type: string, id: string, detail?: any): boolean => {
		return eventManagerRef.current?.dispatchEvent(
			new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
		);
	};

	return { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener };
};
