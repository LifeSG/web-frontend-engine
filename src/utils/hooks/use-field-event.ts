import { useContext } from "react";
import { EventContext } from "../../components/frontend-engine/event";

/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */
export const useFieldEvent = () => {
	const { eventManager } = useContext(EventContext);

	const addFieldEventListener = (
		type: string,
		id: string,
		listener: (this: Element, ev: Event) => unknown,
		options?: boolean | AddEventListenerOptions
	) => {
		eventManager?.addEventListener(`${id}:${type}`, listener, options);
	};

	const removeFieldEventListener = (
		type: string,
		id: string,
		listener: (this: Element, ev: Event) => unknown,
		options?: boolean | AddEventListenerOptions
	) => {
		eventManager?.removeEventListener(`${id}:${type}`, listener, options);
	};

	const dispatchFieldEvent = (type: string, id: string, detail?: any): boolean => {
		return eventManager?.dispatchEvent(
			new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
		);
	};

	return { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener };
};
