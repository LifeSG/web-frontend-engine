import React, { MutableRefObject, useEffect, useRef } from "react";
import { AutoResizeTextareaContainer } from "./auto-resize-textarea.styles";
import { IAutoResizeTextareaProps } from "./types";

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, IAutoResizeTextareaProps>((props, ref) => {
	const { rows, maxLength, resizable = false, id = "component", ...otherProps } = props;

	const innerRef = useRef<HTMLTextAreaElement>(null);
	const maxScrollHeightRef = useRef(0);

	useEffect(() => {
		innerRef.current?.addEventListener("focusout", () => innerRef?.current?.scroll({ top: 0 }));
		return () => innerRef.current?.removeEventListener("focusout", () => innerRef?.current?.scroll({ top: 0 }));
	}, []);

	useEffect(() => {
		const textareaNode =
			(ref as MutableRefObject<HTMLTextAreaElement>)?.current ||
			(innerRef as MutableRefObject<HTMLTextAreaElement>)?.current;

		if (textareaNode) {
			const computedStyle = getComputedStyle(textareaNode);
			const { lineHeight, paddingTop, paddingBottom } = computedStyle;
			const [intLineHeight, intPaddingTop, intPaddingBottom] = [lineHeight, paddingTop, paddingBottom].map(
				(stringVal) => parseInt(stringVal, 10)
			);

			maxScrollHeightRef.current = intLineHeight + intPaddingTop + intPaddingBottom;
		}
	}, [ref, innerRef]);

	return (
		<AutoResizeTextareaContainer
			id={`textarea-${id}`}
			ref={ref || innerRef}
			maxLength={maxLength}
			rows={rows ? rows - 1 : 1}
			resizable={resizable}
			{...otherProps}
		/>
	);
});
