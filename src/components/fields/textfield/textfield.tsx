import { Form } from "@lifesg/react-design-system";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITextfieldSchema } from "./types";

export const TextField = React.forwardRef<HTMLInputElement, IGenericFieldProps<ITextfieldSchema>>((props, ref) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { id, title, type, value, maxLength, inputMode, validation },
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string | number | readonly string[]>(value || "");
	const { setFieldValidationConfig } = useValidationSchema();

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		const isString = type !== "NUMBER";
		setFieldValidationConfig(id, isString ? Yup.string() : Yup.number(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStateValue(event.target.value);
		onChange(event);
	};

	return (
		<Form.Input
			{...otherProps}
			ref={ref}
			id={id}
			label={title}
			inputMode={inputMode}
			onChange={handleChange}
			value={stateValue}
			errorMessage={otherProps.error?.message}
		/>
	);
});
