import { Checkbox, Form } from "@lifesg/react-design-system";
import pull from "lodash/pull";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Label } from "./checkbox-group.styles";
import { ICheckboxGroupSchema, ICheckboxOption } from "./types";

export const CheckboxGroup = (props: IGenericFieldProps<ICheckboxGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation, ...otherSchema },
		id,
		name,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const [isFirstMount, setIsFirstMount] = useState<boolean>(true);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.array().of(Yup.string()), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (value) {
			if (isFirstMount) {
				handleDefaultValue(value);
				setIsFirstMount(false);
			} else {
				setStateValue(value);
			}
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		const isChecked = event.target.checked;
		const updatedStateValues = stateValue;

		if (isChecked) {
			updatedStateValues.push(value);
		} else {
			pull(updatedStateValues, value);
		}

		setStateValue(updatedStateValues);
		onChange({ target: { value: updatedStateValues } });
	};

	const handleDefaultValue = (options: ICheckboxOption[]): void => {
		if (ObjectHelper.containsLabelValue(options, "value")) {
			const initStateValue = options.map((option) => option.value);

			setStateValue(initStateValue);
			onChange({ target: { value: initStateValue } });
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getCheckboxStatus = (label: string): boolean => {
		return stateValue.includes(label);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderCheckboxes = () => {
		return (
			options.length > 0 &&
			options.map((option) => (
				<Label key={option.label}>
					<Checkbox
						{...otherSchema}
						id={id}
						name={option.label}
						value={option.value}
						checked={getCheckboxStatus(option.value)}
						onChange={handleChange}
					/>
					{option.label}
				</Label>
			))
		);
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			{renderCheckboxes()}
		</Form.CustomField>
	);
};
