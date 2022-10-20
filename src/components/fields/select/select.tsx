import { Form, InputSelect } from "@lifesg/react-design-system";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ISelectRef, ISelectSchema } from "./types";

export const Select = React.forwardRef<ISelectRef, IGenericFieldProps<ISelectSchema>>((props, ref) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		schema: { id, title, validation, defaultValue, ...otherSchema },
		name,
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
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (defaultValue) {
			setStateValue(defaultValue);
			onChange({ target: { value: defaultValue } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (value) {
			setStateValue(value);
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (_, extractedValue: string): void => {
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
				{...otherSchema}
				id={TestHelper.generateId(id, "select")}
				name={name}
				onSelectOption={handleChange}
				selectedOption={stateValue}
			/>
		</Form.CustomField>
	);
});
