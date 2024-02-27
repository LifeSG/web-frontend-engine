import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form/types";
import React, { HTMLInputTypeAttribute, useEffect, useState, useRef, useLayoutEffect } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./types";

export const TextField = (props: IGenericFieldProps<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		value,
		schema: { customOptions, inputMode, label: _label, uiType, validation, ...otherSchema },
		...otherProps
	} = props;
	const isText = !["email-field", "numeric-field"].includes(uiType);

	const [stateValue, setStateValue] = useState<string | number>(value || "");
	const [derivedAttributes, setDerivedAttributes] = useState<FormInputProps>({});
	const { setFieldValidationConfig } = useValidationConfig();

	const ref = useRef<HTMLInputElement>(null);
	const caret = useRef<number>(0);

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		switch (uiType) {
			case "numeric-field": {
				setFieldValidationConfig(id, Yup.number(), validation);
				const minRule = validation?.find((rule) => "min" in rule);
				const maxRule = validation?.find((rule) => "max" in rule);
				const attributes = { ...derivedAttributes };
				if (minRule?.min > 0) {
					attributes.min = minRule.min;
				}
				if (maxRule?.max > 0) {
					attributes.max = maxRule.max;
				}
				setDerivedAttributes(attributes);
				break;
			}
			case "email-field": {
				const emailRule = validation?.find((rule) => rule.email);
				setFieldValidationConfig(
					id,
					Yup.string().email(emailRule?.errorMessage || ERROR_MESSAGES.EMAIL.INVALID),
					validation
				);

				const maxRule = validation?.find((rule) => "max" in rule);
				const lengthRule = validation?.find((rule) => "length" in rule);
				const attributes = { ...derivedAttributes };
				if (maxRule?.max > 0) {
					attributes.maxLength = maxRule.max;
				} else if (lengthRule?.length > 0) {
					attributes.maxLength = lengthRule.length;
				}
				setDerivedAttributes(attributes);
				break;
			}
			case "text-field": {
				setFieldValidationConfig(id, Yup.string(), validation);

				const maxRule = validation?.find((rule) => "max" in rule);
				const lengthRule = validation?.find((rule) => "length" in rule);
				const attributes = { ...derivedAttributes };
				if (maxRule?.max > 0) {
					attributes.maxLength = maxRule.max;
				} else if (lengthRule?.length > 0) {
					attributes.maxLength = lengthRule.length;
				}
				setDerivedAttributes(attributes);
				break;
			}
			default:
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (value !== stateValue) {
			setStateValue(value || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useLayoutEffect(() => {
		if (isText && ref.current.selectionEnd !== caret.current) {
			// keep caret in place after uppercase, not available for 'email' & 'number' HTML input types
			ref.current.setSelectionRange(caret.current, caret.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateValue]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (uiType === "numeric-field" && !event.target.value) {
			onChange({ target: { value: undefined } });
		} else {
			const inputted = event.target.value;
			const doUpperCase = isText && customOptions?.uppercase && inputted !== inputted.toUpperCase();

			caret.current = event.target.selectionEnd; // must save current caret position before mutating event.target
			if (doUpperCase) {
				event.target.value = inputted.toUpperCase();
			}

			onChange(event);
		}

		setStateValue(event.target.value);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatInputMode = (): React.HTMLAttributes<HTMLInputElement>["inputMode"] => {
		if (inputMode) return inputMode;

		switch (uiType) {
			case "numeric-field":
				return "numeric";
			case "email-field":
				return "email";
			case "text-field":
				return "text";
			default:
				return "none";
		}
	};

	const formatInputType = (): HTMLInputTypeAttribute => {
		switch (uiType) {
			case "numeric-field":
				return "number";
			case "email-field":
				return "email";
			case "text-field":
			default:
				return "text";
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.Input
			{...otherSchema}
			{...otherProps}
			{...derivedAttributes}
			id={id}
			data-testid={TestHelper.generateId(id, uiType)}
			ref={ref}
			type={formatInputType()}
			label={formattedLabel}
			onPaste={(e) => (customOptions?.preventCopyAndPaste ? e.preventDefault() : null)}
			onDrop={(e) => (customOptions?.preventDragAndDrop ? e.preventDefault() : null)}
			inputMode={formatInputMode()}
			onChange={handleChange}
			value={stateValue}
			errorMessage={error?.message}
		/>
	);
};
