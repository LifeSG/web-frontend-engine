import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form/types";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ERROR_MESSAGES } from "../../shared";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "./types";

export const TextField = (props: IGenericFieldProps<ITextfieldSchema | IEmailSchema | INumberSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { inputMode, label, fieldType, validation, ...otherSchema },
		id,
		value,
		onChange,
		error,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string | number>(value || "");
	const [derivedAttributes, setDerivedAttributes] = useState<FormInputProps>({});
	const { setFieldValidationConfig } = useValidationSchema();

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		switch (fieldType) {
			case "numeric": {
				setFieldValidationConfig(id, Yup.number(), validation);
				const minRule = validation?.find((rule) => "min" in rule);
				const maxRule = validation?.find((rule) => "max" in rule);
				const attributes = { ...derivedAttributes };
				if (minRule) {
					attributes.min = minRule.min;
				}
				if (maxRule) {
					attributes.max = maxRule.max;
				}
				setDerivedAttributes(attributes);
				break;
			}
			case "email":
				{
					const emailRule = validation?.find((rule) => rule.email);
					setFieldValidationConfig(
						id,
						Yup.string().email(emailRule?.errorMessage || ERROR_MESSAGES.EMAIL.INVALID),
						validation
					);
				}
				break;
			case "text":
				setFieldValidationConfig(id, Yup.string(), validation);
				break;
			default:
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || "");
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		onChange(event);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatInputMode = (): React.HTMLAttributes<HTMLInputElement>["inputMode"] => {
		if (inputMode) return inputMode;

		switch (fieldType) {
			case "numeric":
				return "numeric";
			case "email":
				return "email";
			case "text":
				return "text";
			default:
				return "none";
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
			data-testid={TestHelper.generateId(id, fieldType)}
			type={fieldType}
			label={label}
			inputMode={formatInputMode()}
			onChange={handleChange}
			value={stateValue}
			errorMessage={error?.message}
		/>
	);
};
