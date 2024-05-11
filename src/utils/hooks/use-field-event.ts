import { useCallback, useContext } from "react";
import { EventContext, TAddFieldEventListener, TRemoveFieldEventListener } from "../../context-providers";
import { TFieldEventListener } from "../types";

/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */

export const useFieldEvent = () => {
	const { eventManagerRef } = useContext(EventContext);

	const addFieldEventListener: TAddFieldEventListener = useCallback(
		<T = any>(
			arg1: string,
			arg2: string,
			arg3: string | TFieldEventListener<T>,
			arg4?: TFieldEventListener<T> | boolean | AddEventListenerOptions | undefined,
			arg5?: boolean | AddEventListenerOptions | undefined
		) => {
			if (typeof arg3 === "function" && typeof arg4 !== "function") {
				// default function without uiType
				const [type, id, callback, options] = [arg1, arg2, arg3, arg4];
				eventManagerRef.current?.addEventListener(`${id}:${type}`, callback, options);
			} else if (typeof arg4 === "function") {
				// new function overloading with uiType
				const [_uiType, type, id, callback, options] = [arg1, arg2, arg3, arg4, arg5];
				eventManagerRef.current?.addEventListener(`${id}:${type}`, callback, options);
			}
		},
		[eventManagerRef]
	);

	const removeFieldEventListener: TRemoveFieldEventListener = useCallback(
		<T = any>(
			arg1: string,
			arg2: string,
			arg3: string | TFieldEventListener<T>,
			arg4?: TFieldEventListener<T> | boolean | AddEventListenerOptions | undefined,
			arg5?: boolean | AddEventListenerOptions | undefined
		) => {
			if (typeof arg3 === "function" && typeof arg4 !== "function") {
				// default function without uiType
				const [type, id, callback, options] = [arg1, arg2, arg3, arg4];
				eventManagerRef.current?.removeEventListener(`${id}:${type}`, callback, options);
			} else if (typeof arg4 === "function") {
				// new function overloading with uiType
				const [_uiType, type, id, callback, options] = [arg1, arg2, arg3, arg4, arg5];
				eventManagerRef.current?.removeEventListener(`${id}:${type}`, callback, options);
			}
		},
		[eventManagerRef]
	);

	/**
	 * Dispatches a custom event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
	 */
	const dispatchFieldEvent = useCallback(
		<T = any>(arg1: string, arg2: string, arg3?: string | T | undefined, arg4?: T | undefined): boolean => {
			if (typeof arg3 !== "string") {
				// default function without uiType
				const [type, id, detail] = [arg1, arg2, arg3];
				return eventManagerRef.current?.dispatchEvent(
					new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
				);
			} else {
				// new function overloading with uiType
				const [_uiType, type, id, detail] = [arg1, arg2, arg3, arg4];
				return eventManagerRef.current?.dispatchEvent(
					new CustomEvent(`${id}:${type}`, { cancelable: true, detail: { id, ...detail } })
				);
			}
		},
		[eventManagerRef]
	);

	return { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener };
};
