import { useCallback, useContext } from "react";
import { EventContext } from "../../context-providers";

/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */

// TODO how to make better typing
export const useFieldEvent = () => {
	const { eventManagerRef } = useContext(EventContext);

	const addFieldEventListener = useCallback(
		<T = any>(
			type: string,
			id: string,
			listener: (ev: CustomEvent<T>) => void,
			options?: boolean | AddEventListenerOptions
		) => {
			eventManagerRef.current?.addEventListener(`${id}:${type}`, listener, options);
		},
		[eventManagerRef]
	);

	const removeFieldEventListener = useCallback(
		<T = any>(
			type: string,
			id: string,
			listener: (ev: CustomEvent<T>) => void,
			options?: boolean | EventListenerOptions
		) => {
			eventManagerRef.current?.removeEventListener(`${id}:${type}`, listener, options);
		},
		[eventManagerRef]
	);

	/**
	 * Dispatches a custom event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
	 */
	const dispatchFieldEvent = useCallback(
		<T = any>(type: string, id: string, detail?: T): boolean => {
			return eventManagerRef.current?.dispatchEvent(
				new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
			);
		},
		[eventManagerRef]
	);

	return { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener };
};
