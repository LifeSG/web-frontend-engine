import { Form } from "@lifesg/react-design-system/form";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Label, RadioContainer, StyledRadioButton } from "./radio-button.styles";
import { IRadioButtonGroupSchema } from "./types";

export const RadioButtonGroup = (props: IGenericFieldProps<IRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, disabled, validation, ...otherSchema },
		id,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || []);
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
	const getRadioButtonStatus = (value: string): boolean => {
		return stateValue === value;
	};

	const formatRadioButtonId = (id: string, index: number): string => {
		return `${id}-${index}`;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderRadioButtons = () => {
		return (
			options.length > 0 &&
			options.map((option, index) => {
				const radioButtonId = formatRadioButtonId(id, index);

				return (
					<RadioContainer key={index}>
						<StyledRadioButton
							{...otherSchema}
							id={radioButtonId}
							disabled={disabled}
							name={option.label}
							value={option.value}
							checked={getRadioButtonStatus(option.value)}
							onChange={handleChange}
						/>
						<Label htmlFor={radioButtonId} disabled={disabled}>
							{option.label}
						</Label>
					</RadioContainer>
				);
			})
		);
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			{renderRadioButtons()}
		</Form.CustomField>
	);
};
