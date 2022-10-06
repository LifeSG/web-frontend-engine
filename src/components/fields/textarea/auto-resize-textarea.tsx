import React, { MutableRefObject, useEffect, useRef } from "react";
import { InteractionHelper } from "../../../helpers";
import { AutoResizeTextareaContainer } from "./auto-resize-textarea.styles";
import { IAutoResizeTextareaProps } from "./types";

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, IAutoResizeTextareaProps>((props, ref) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const { rows, maxLength, resizable = false, id = "component", ...otherProps } = props;

	const innerRef = useRef<HTMLTextAreaElement>(null);
	const maxScrollHeightRef = useRef(0);

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		innerRef.current?.addEventListener("focusout", () => InteractionHelper.scrollRefToTop(innerRef));
		return () =>
			innerRef.current?.removeEventListener("focusout", () => InteractionHelper.scrollRefToTop(innerRef));
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

	// ================================================
	// HELPER FUNCTIONS
	// ================================================
	const handleRef = (element: HTMLTextAreaElement) => {
		InteractionHelper.handleTextareaRefCallback(element, innerRef, ref);
	};

	return (
		<AutoResizeTextareaContainer
			{...otherProps}
			id={`textarea-${id}`}
			ref={handleRef}
			maxLength={maxLength}
			rows={rows ? rows - 1 : 1}
			resizable={resizable}
		/>
	);
});
