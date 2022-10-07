import * as Yup from "yup";
import { kebabCase } from "lodash";
import React, { useEffect, useRef } from "react";
import { Form } from "react-lifesg-design-system";
import { useValidationSchema } from "src/utils/hooks";
import { InteractionHelper, TestHelper } from "../../../helpers";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { ChipContainer, ChipItem } from "./textarea.styles";
import { ITextareaProps } from "./types";

export const TextArea = React.forwardRef<HTMLTextAreaElement, IGenericFieldProps<ITextareaProps>>((props, ref) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { chipTexts, chipPosition = "top", maxLength, rows, resizable = false, id, title, validation },
		...otherProps
	} = props;

	const innerRef = useRef<HTMLTextAreaElement>(null);
	const { setFieldValidationConfig } = useValidationSchema();

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);

		innerRef.current?.addEventListener("focusout", () => InteractionHelper.scrollRefToTop(innerRef));
		return () =>
			innerRef.current?.removeEventListener("focusout", () => InteractionHelper.scrollRefToTop(innerRef));
	}, []);

	// ================================================
	// HELPER FUNCTIONS
	// ================================================
	const handleChipOnClick = (text: string) => () => {
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

	const handleRef = (element: HTMLTextAreaElement) => {
		InteractionHelper.handleTextareaRefCallback(element, innerRef, ref);
	};

	const renderChips = () => {
		return (
			chipTexts?.length && (
				<ChipContainer>
					{chipTexts.map((text, index) => (
						<ChipItem
							key={text}
							id={TestHelper.generateId(`${id}-chip`, kebabCase(text), index)}
							onClick={handleChipOnClick(text)}
						>
							{text}
						</ChipItem>
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
					{...otherProps}
					id={id}
					ref={handleRef}
					maxLength={maxLength}
					rows={rows}
					resizable={resizable}
					errorMessage={otherProps.error?.message}
				/>

				{chipPosition === "bottom" && renderChips()}
			</>
		</Form.CustomField>
	);
});
