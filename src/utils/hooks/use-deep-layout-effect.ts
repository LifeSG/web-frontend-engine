import isEqual from "lodash/isEqual";
import { useLayoutEffect, useRef } from "react";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";

export const useDeepLayoutEffect: typeof useLayoutEffect = (callback, dependencies) => {
	const ref = useRef(dependencies);
	const signalRef = useRef<number>(0);

	if (!isEqual(dependencies, ref.current)) {
		ref.current = dependencies;
		signalRef.current += 1;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useLayoutEffect(callback, [signalRef.current]);
};

export const useIsomorphicDeepLayoutEffect =
	typeof window !== "undefined" ? useDeepLayoutEffect : useDeepCompareEffectNoCheck;
