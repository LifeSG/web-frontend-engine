import { Form, InputMultiSelect } from "@lifesg/react-design-system";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { IMultiSelectRef, IMultiSelectSchema, IOption } from "./types";

export const MultiSelect = React.forwardRef<IMultiSelectRef, IGenericFieldProps<IMultiSelectSchema>>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { id, title, validation, ...otherSchema },
		name,
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || "");
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
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
	const handleChange = (extractedValue: string[]): void => {
		setStateValue(extractedValue);
		onChange({
			target: {
				value: extractedValue,
			},
		});
	};

	return (
		<Form.CustomField {...otherProps} id={id} label={title} errorMessage={otherProps.error?.message}>
			<InputMultiSelect
				{...otherSchema}
				id={TestHelper.generateId(id, "select")}
				name={name}
				onSelectOptions={handleChange}
				selectedOptions={stateValue}
				valueExtractor={(item: IOption) => item.value}
				listExtractor={(item: IOption) => item.label}
			/>
		</Form.CustomField>
	);
});
