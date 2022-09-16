import React, { useEffect, useRef } from "react";
import { Form } from "react-lifesg-design-system";
import { IGenericFieldProps } from "../../types";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { ChipContainer } from "./textarea.styles";
import { ITextareaProps } from "./types";

export const TextArea = React.forwardRef<HTMLTextAreaElement, IGenericFieldProps<ITextareaProps>>((props, ref) => {
	const {
		schema: { chipTexts, chipPosition = "top", maxLength, rows, resizable = false, id, title },
		...otherProps
	} = props;

	const innerRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		innerRef.current?.addEventListener("focusout", () => innerRef?.current?.scroll({ top: 0 }));
		return () => innerRef.current?.removeEventListener("focusout", () => innerRef?.current?.scroll({ top: 0 }));
	}, []);

	const chipOnClickHandler = (text: string) => () => {
		const textareaNode = innerRef?.current;

		if (textareaNode) {
			const curLength = textareaNode.value.length;
			if (maxLength && curLength >= maxLength) {
				return;
			}

			const newValue = (textareaNode.value + (curLength ? ` ${text}` : text)).substring(0, maxLength);

			// Calling input as context because set value via `.value =` is not working
			// Reference from https://stackoverflow.com/a/46012210
			const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor?.(
				window.HTMLTextAreaElement.prototype,
				"value"
			)?.set;
			nativeTextAreaValueSetter?.call(textareaNode, newValue);

			const event = new Event("input", { bubbles: true });
			textareaNode.dispatchEvent(event);
		}
	};

	const renderChips = () => {
		return (
			chipTexts?.length && (
				<ChipContainer>
					{chipTexts.map((text, index) => (
						<div key={index}>{text}</div>
					))}
				</ChipContainer>
			)
		);
	};

	return (
		<Form.CustomField label={title} id={id}>
			<>
				{chipPosition === "top" && renderChips()}
				<AutoResizeTextarea
					id={id}
					maxLength={maxLength}
					rows={rows}
					resizable={resizable}
					errorMessage={otherProps.error?.message}
					{...otherProps}
				/>

				{chipPosition === "bottom" && renderChips()}
			</>
		</Form.CustomField>
	);
});
