import { Form } from "@lifesg/react-design-system/form";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITextfieldSchema } from "./types";

export const TextField = (props: IGenericFieldProps<ITextfieldSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { id, inputMode, title, type, validation, ...otherSchema },
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
	}, [validation]);

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
	const formatInputMode = (): React.HTMLAttributes<HTMLInputElement>["inputMode"] => {
		if (inputMode) return inputMode;
		switch (type) {
			case "NUMBER":
				return "numeric";
			case "EMAIL":
				return "email";
			case "TEXT":
				return "text";
			default:
				return "none";
		}
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
