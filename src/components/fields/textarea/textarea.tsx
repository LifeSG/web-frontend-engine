import { Form } from "@lifesg/react-design-system";
import { kebabCase } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
import * as Yup from "yup";
import { InteractionHelper, TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { ChipContainer, ChipItem, StyledTextArea, Wrapper } from "./textarea.styles";
import { ITextareaSchema } from "./types";

export const TextArea = React.forwardRef<HTMLTextAreaElement, IGenericFieldProps<ITextareaSchema>>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { chipTexts, chipPosition, maxLength, rows = 1, resizable, id, title, validation },
		name,
		onChange,
		value,
		...otherProps
	} = props;
	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const { setValue } = useForm();
	const innerRef = useRef<HTMLTextAreaElement>(null);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	useEffect(() => {
		setValue(name, stateValue);
	}, [name, setValue, stateValue]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setStateValue(event.target.value);
		onChange(event);
	};

	const handleChipOnClick = (text: string) => () => {
		const curLength = (stateValue as string)?.length || 0;
		if (maxLength && curLength >= maxLength) {
			return;
		}

		const newValue = ((stateValue || "") + (curLength ? ` ${text}` : text)).substring(0, maxLength);
		setStateValue(newValue);

		onChange({
			target: {
				value: newValue,
			},
		});
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleRef = (element: HTMLTextAreaElement) => {
		InteractionHelper.handleRefCallback(element, innerRef, ref);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChips = () => {
		return (
			chipTexts?.length && (
				<ChipContainer>
					{chipTexts.map((text, index) => (
						<ChipItem
							key={text}
							id={TestHelper.generateId(id, `chip-${kebabCase(text)}`, index)}
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
			<Wrapper chipPosition={chipPosition}>
				{renderChips()}
				<StyledTextArea
					{...otherProps}
					ref={handleRef}
					id={TestHelper.generateId(id, "textarea")}
					name={name}
					maxLength={maxLength}
					rows={rows}
					resizable={resizable}
					onChange={handleChange}
					value={stateValue}
					errorMessage={otherProps.error?.message}
				/>
			</Wrapper>
		</Form.CustomField>
	);
});
