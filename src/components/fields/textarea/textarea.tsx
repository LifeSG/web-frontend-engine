import { Form } from "@lifesg/react-design-system/form";
import { kebabCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Chip, Warning } from "../../shared";
import { IGenericFieldProps } from "../types";
import { ChipContainer, StyledTextarea, Wrapper } from "./textarea.styles";
import { ITextareaSchema } from "./types";

export const Textarea = (props: IGenericFieldProps<ITextareaSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		name,
		onChange,
		schema: { className, chipTexts, chipPosition, rows = 1, resizable, label: _label, validation, ...otherSchema },
		value,
		warning,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
							className={className ? `${className}-chip ${className}-chip-${kebabCase(text)}` : undefined}
							onClick={handleChipOnClick(text)}
						>
							{text}
						</Chip>
					))}
				</ChipContainer>
			)
		);
	};

	const renderLabel = () => {
		const baseId = `${id}-base`;
		if (typeof formattedLabel === "string") {
			return <Form.Label htmlFor={baseId}>{formattedLabel}</Form.Label>;
		} else {
			return (
				<Form.Label {...formattedLabel} htmlFor={baseId}>
					{formattedLabel?.children}
				</Form.Label>
			);
		}
	};

	return (
		<>
			<Form.CustomField id={id}>
				{renderLabel()}
				<Wrapper chipPosition={chipPosition}>
					{renderChips()}
					<StyledTextarea
						{...otherSchema}
						{...otherProps}
						id={id}
						data-testid={TestHelper.generateId(id, "textarea")}
						className={className}
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
			<Warning id={id} message={warning} />
		</>
	);
};
