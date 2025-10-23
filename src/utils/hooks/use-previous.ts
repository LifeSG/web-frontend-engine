import { useEffect, useRef } from "react";

/**
 * tracks the previous value
 */
export const usePrevious = <T = unknown>(value: T) => {
	const ref = useRef<T>(null);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};
