import { Form, InputSelect } from "@lifesg/react-design-system";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ISelectRef, ISelectSchema } from "./types";

export const Select = React.forwardRef<ISelectRef, IGenericFieldProps<ISelectSchema>>((props, ref) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { id, title, disabled, options, placeholder, listStyleWidth, validation },
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string | number | readonly string[]>("");
	const { setFieldValidationConfig } = useValidationSchema();

	// ================================================
	// EFFECTS
	// ================================================
	useEffect(() => {
		setFieldValidationConfig(id, (Yup as any)[typeof options[0]](), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (_, extractedValue) => {
		setStateValue(extractedValue);
		onChange({
			target: {
				value: extractedValue,
			},
		});
	};

	return (
		<Form.CustomField {...otherProps} id={id} label={title} errorMessage={otherProps.error?.message}>
			<InputSelect
				id={id}
				onSelectOption={handleChange}
				selectedOption={stateValue}
				options={options}
				placeholder={placeholder}
				listStyleWidth={listStyleWidth}
				disabled={disabled}
			/>
		</Form.CustomField>
	);
});
