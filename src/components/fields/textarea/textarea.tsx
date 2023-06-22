import { Form } from "@lifesg/react-design-system/form";
import { kebabCase } from "lodash";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { Chip } from "../../shared";
import { ChipContainer, StyledTextarea, Wrapper } from "./textarea.styles";
import { ITextareaSchema } from "./types";
import { useFormContext } from "react-hook-form";

export const Textarea = (props: IGenericFieldProps<ITextareaSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { chipTexts, chipPosition, rows = 1, resizable, label, validation, ...otherSchema },
		id,
		name,
		onChange,
		value,
		error,
		...otherProps
	} = props;
	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const [maxLength, setMaxLength] = useState<number>();
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		// ensure default value is passed to react-hook-form on mount
		// this is used in conjunction with chips + textarea field
		setValue(id, value);
	}, []);

	useEffect(() => {
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);
		if (maxRule?.max > 0) setMaxLength(maxRule.max);
		else if (lengthRule?.length > 0) setMaxLength(lengthRule.length);

		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || "");
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
				<ChipContainer $chipPosition={chipPosition}>
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
		<Form.CustomField label={label} id={id} errorMessage={error?.message}>
			<Wrapper chipPosition={chipPosition}>
				{renderChips()}
				<StyledTextarea
					{...otherSchema}
					{...otherProps}
					id={id + "-base"}
					data-testid={TestHelper.generateId(id, "textarea")}
					name={name}
					maxLength={maxLength}
					rows={rows}
					resizable={resizable}
					onChange={handleChange}
					value={stateValue}
					error={!!error?.message}
				/>
			</Wrapper>
		</Form.CustomField>
	);
};
