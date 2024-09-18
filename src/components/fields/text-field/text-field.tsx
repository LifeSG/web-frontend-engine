import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { AddonProps } from "@lifesg/react-design-system/input-group";
import * as Icons from "@lifesg/react-icons";
import React, { HTMLInputTypeAttribute, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { Warning } from "../../shared/warning";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./types";

export const TextField = (props: IGenericFieldProps<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const { error, formattedLabel, id, onChange, value, schema, warning, ...otherProps } = props;
	const { customOptions, inputMode, label: _label, uiType, validation, ...otherSchema } = schema;

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

	useEffect(() => {
		if (uiType === "text-field" && ref.current.selectionEnd !== caret.current) {
			// keep caret in place after uppercase, not available for 'email' & 'number' HTML input types
			ref.current.setSelectionRange(caret.current, caret.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateValue]);

	useEffect(() => {
		if (schema.uiType === "text-field" && schema.customOptions?.textTransform === "uppercase" && stateValue) {
			setStateValue((previous) => previous?.toString().toUpperCase());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schema.uiType === "text-field" && schema.customOptions?.textTransform]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (uiType === "numeric-field") {
			const isNumber = !isNaN(parseFloat(event.target.value));
			const valueToUpdate = isNumber ? +event.target.value : undefined;
			onChange({ target: { value: valueToUpdate } });
			setStateValue(valueToUpdate);
			return;
		}

		if (schema.uiType === "text-field") {
			caret.current = event.target.selectionEnd; // must save current caret position before mutating event.target

			if (schema.customOptions?.textTransform === "uppercase") {
				event.target.value = event.target.value.toUpperCase();
			}

			onChange(event);
		} else {
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

	const hasAddOn = () => {
		return !!customOptions?.addOn;
	};

	const buildAddOn = (): AddonProps<undefined, undefined> => {
		if (!hasAddOn()) {
			return undefined;
		}

		if (customOptions.addOn.type === "label") {
			return {
				type: "label",
				position: customOptions.addOn.position,
				attributes: {
					value: customOptions.addOn.value,
				},
			};
		}

		if (customOptions.addOn.type === "icon") {
			const { icon, position, color } = customOptions.addOn;
			const Element = Icons[icon];
			return {
				type: "custom",
				position: position,
				attributes: {
					children: <CustomIcon as={Element} $color={color} />,
				},
			};
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const InputElement = hasAddOn() ? Form.InputGroup : Form.Input;

	return (
		<>
			<InputElement
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
				addon={buildAddOn()}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};

interface CustomIconStyleProps {
	$color?: string;
}

const CustomIcon = styled.div<CustomIconStyleProps>`
	${({ $color }) => $color && `color: ${$color};`}
`;
