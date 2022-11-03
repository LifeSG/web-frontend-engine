import { Form } from "@lifesg/react-design-system/form";
import { without } from "lodash";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Label, StyledCheckbox } from "./checkbox-group.styles";
import { ICheckboxGroupSchema } from "./types";

export const CheckboxGroup = (props: IGenericFieldProps<ICheckboxGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation, ...otherSchema },
		id,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.array()
				.of(Yup.string())
				.test("is-empty-array", "An option is required", (value) => {
					if (!value) return true;

					return value.length > 0;
				}),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || []);
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		let updatedStateValues = stateValue;

		if (updatedStateValues.includes(value)) {
			updatedStateValues = without(updatedStateValues, value);
		} else {
			updatedStateValues.push(value);
		}

		setStateValue(updatedStateValues);
		onChange({ target: { value: updatedStateValues } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getCheckboxStatus = (value: string): boolean => {
		return stateValue.includes(value);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderCheckboxes = () => {
		return (
			options.length > 0 &&
			options.map((option) => (
				<Label key={option.label}>
					<StyledCheckbox
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
