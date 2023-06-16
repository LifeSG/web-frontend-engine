import { useContext } from "react";
import { EventContext } from "../../components/frontend-engine/event";

/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */

// TODO how to make better typing
export const useFieldEvent = () => {
	const { eventManagerRef } = useContext(EventContext);

	const addFieldEventListener = <T = any>(
		type: string,
		id: string,
		listener: (ev: CustomEvent<T>) => void,
		options?: boolean | AddEventListenerOptions
	) => {
		eventManagerRef.current?.addEventListener(`${id}:${type}`, listener, options);
	};

	const removeFieldEventListener = <T = any>(
		type: string,
		id: string,
		listener: (ev: CustomEvent<T>) => void,
		options?: boolean | EventListenerOptions
	) => {
		eventManagerRef.current?.removeEventListener(`${id}:${type}`, listener, options);
	};

	const dispatchFieldEvent = <T = any>(type: string, id: string, detail?: T): boolean => {
		return eventManagerRef.current?.dispatchEvent(
			new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
		);
	};

	return { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener };
};
