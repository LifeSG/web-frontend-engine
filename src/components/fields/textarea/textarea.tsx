import { Form } from "@lifesg/react-design-system/form";
import { kebabCase } from "lodash";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { Chip } from "../../shared";
import { ChipContainer, StyledTextArea, Wrapper } from "./textarea.styles";
import { ITextareaSchema } from "./types";

export const TextArea = (props: IGenericFieldProps<ITextareaSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { chipTexts, chipPosition, maxLength, rows = 1, resizable, label, validation, ...otherSchema },
		id,
		name,
		onChange,
		value,
		error,
		...otherProps
	} = props;
	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event);
	};

	const handleChipOnClick = (text: string) => () => {
		const curLength = (stateValue as string)?.length || 0;
		if (maxLength && curLength >= maxLength) {
			return;
		}
		const newValue = ((stateValue || "") + (curLength ? ` ${text}` : text)).substring(0, maxLength);

		onChange({
			target: {
				value: newValue,
			},
		});
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChips = () => {
		return (
			chipTexts?.length && (
				<ChipContainer>
					{chipTexts.map((text, index) => (
						<Chip
							key={text}
							id={TestHelper.generateId(id, `chip-${kebabCase(text)}`, index)}
							onClick={handleChipOnClick(text)}
						>
							{text}
						</Chip>
					))}
				</ChipContainer>
			)
		);
	};

	return (
		<Form.CustomField label={label} id={id}>
			<Wrapper chipPosition={chipPosition}>
				{renderChips()}
				<StyledTextArea
					{...otherSchema}
					{...otherProps}
					id={id}
					data-testid={TestHelper.generateId(id, "textarea")}
					name={name}
					maxLength={maxLength}
					rows={rows}
					resizable={resizable}
					onChange={handleChange}
					value={stateValue}
					errorMessage={error?.message}
				/>
			</Wrapper>
		</Form.CustomField>
	);
};
