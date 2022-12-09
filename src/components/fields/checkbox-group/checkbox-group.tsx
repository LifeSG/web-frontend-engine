import { Form } from "@lifesg/react-design-system/form";
import without from "lodash/without";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ERROR_MESSAGES } from "../../shared";
import { CheckboxContainer, Label, StyledCheckbox } from "./checkbox-group.styles";
import { ICheckboxGroupSchema } from "./types";

export const CheckboxGroup = (props: IGenericFieldProps<ICheckboxGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation, disabled, ...otherSchema },
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
		const isRequiredRule = validation?.find((rule) => "required" in rule);

		setFieldValidationConfig(
			id,
			Yup.array()
				.of(Yup.string())
				.test(
					"is-empty-array",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.REQUIRED_OPTION,
					(value) => {
						if (!value || !isRequiredRule?.required) return true;

						return value.length > 0;
					}
				),
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
		let updatedStateValues = [...stateValue];

		if (updatedStateValues.includes(value)) {
			updatedStateValues = without(updatedStateValues, value);
		} else {
			updatedStateValues.push(value);
		}

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
			options.map((option, index) => {
				const checkboxId = TestHelper.generateId(id, "checkbox");

				return (
					<CheckboxContainer key={index}>
						<StyledCheckbox
							{...otherSchema}
							id={checkboxId}
							data-testid={id}
							disabled={disabled}
							name={option.label}
							value={option.value}
							checked={getCheckboxStatus(option.value)}
							onChange={handleChange}
						/>
						<Label htmlFor={checkboxId} disabled={disabled}>
							{option.label}
						</Label>
					</CheckboxContainer>
				);
			})
		);
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			{renderCheckboxes()}
		</Form.CustomField>
	);
};
