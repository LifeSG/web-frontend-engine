import { Form } from "@lifesg/react-design-system/form";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import clsx from "clsx";
import { kebabCase } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { TestHelper, filterSchemaProps } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Chip, Warning } from "../../shared";
import { IGenericFieldProps } from "../types";
import * as styles from "./textarea.styles";
import { ITextareaSchema } from "./types";

export const Textarea = (props: IGenericFieldProps<ITextareaSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { error, formattedLabel, id, onChange, schema, value, warning, onBlur } = props;
	const {
		commonSchema: { validation },
		customSchema: { className, chipTexts, chipPosition, rows = 1, resizable, ...textareaProps },
	} = filterSchemaProps(schema);
	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const [maxLength, setMaxLength] = useState<number>();
	const { setFieldValidationConfig } = useValidationConfig();
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	useApplyStyle(textAreaRef, {
		[styles.tokens.styledTextarea.minHeight]: rows ? `${rows + 2 * 22 + 24}px` : undefined,
	});

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
		if (textAreaRef.current) {
			textAreaRef.current.focus();
		}

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

	const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (event.relatedTarget?.closest(`.${styles.chipContainer}`)) {
			return;
		}
		onBlur();
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChips = () => {
		return (
			chipTexts?.length && (
				<div
					className={clsx(
						styles.chipContainer,
						chipPosition === "bottom"
							? styles.chipContainerChipPositionBottom
							: styles.chipContainerChipPositionTop
					)}
				>
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
				</div>
			)
		);
	};

	return (
		<>
			<Form.CustomField id={id} label={formattedLabel}>
				<div
					className={clsx(
						styles.wrapper,
						chipPosition === "bottom" ? styles.wrapperChipPositionBottom : styles.wrapperChipPositionTop
					)}
				>
					{renderChips()}
					<Form.Textarea
						ref={textAreaRef}
						{...textareaProps}
						id={id}
						data-testid={TestHelper.generateId(id, "textarea")}
						className={clsx(
							styles.styledTextarea,
							resizable ? styles.styledTextareaResizable : styles.styledTextareaNotResizable,
							className
						)}
						maxLength={maxLength}
						rows={rows}
						onChange={handleChange}
						value={stateValue}
						errorMessage={error?.message}
						onBlur={handleBlur}
					/>
				</div>
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
