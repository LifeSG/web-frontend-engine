import { Form } from "@lifesg/react-design-system/form";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITextfieldSchema, TInputMode } from "./types";

export const TextField = (props: IGenericFieldProps<ITextfieldSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { id, title, type, validation, ...otherSchema },
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const { setFieldValidationConfig } = useValidationSchema();

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		switch (type) {
			case "NUMBER":
				setFieldValidationConfig(id, Yup.number(), validation);
				break;
			case "EMAIL":
				setFieldValidationConfig(id, Yup.string().email(), validation);
				break;
			case "TEXT":
				setFieldValidationConfig(id, Yup.string(), validation);
				break;
			default:
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (value) {
			setStateValue(value);
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setStateValue(event.target.value);
		onChange(event);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatInputMode = () => {
		let { inputMode } = "none" as TInputMode;

		switch (type) {
			case "NUMBER":
				inputMode = "numeric";
				break;
			case "EMAIL":
				inputMode = "email";
				break;
			case "TEXT":
				inputMode = "text";
				break;
		}

		return inputMode;
	};

	return (
		<Form.Input
			{...otherSchema}
			{...otherProps}
			id={id}
			label={title}
			inputMode={formatInputMode()}
			onChange={handleChange}
			value={stateValue}
			errorMessage={otherProps.error?.message}
		/>
	);
};
