import React from "react";

interface IRefTypes extends HTMLTextAreaElement {}

export namespace InteractionHelper {
	export const scrollRefToTop = (element: React.MutableRefObject<IRefTypes>) => {
		element?.current?.scroll({ top: 0, behavior: "smooth" });
	};

	// NOTE: https://www.react-hook-form.com/faqs/#Howtosharerefusage
	export const handleRefCallback = <T>(
		element: T,
		innerRef: React.MutableRefObject<T>,
		forwardedRef: React.ForwardedRef<T>
	) => {
		innerRef.current = element;

		if (typeof forwardedRef == "function") {
			forwardedRef(element);
		}
	};
}
