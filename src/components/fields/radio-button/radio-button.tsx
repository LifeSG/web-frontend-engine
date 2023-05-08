import { Form } from "@lifesg/react-design-system/form";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Label, RadioContainer, StyledRadioButton, StyledToggle, ToggleWrapper } from "./radio-button.styles";
import { IRadioButtonGroupSchema } from "./types";

export const RadioButtonGroup = (props: IGenericFieldProps<IRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, disabled, validation, customOptions, ...otherSchema },
		id,
		value,
		error,
		onChange,
	} = props;

	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		if (!options.find((option) => option.value === value)) {
			setValue(id, "");
		}
	}, [options]);

	useEffect(() => {
		setStateValue(value || "");
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value?: string): void => {
		value ?? setStateValue(value);
		value ? onChange({ target: { value } }) : onChange(event);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isRadioButtonChecked = useCallback(
		(value: string): boolean => {
			return stateValue === value;
		},
		[stateValue]
	);

	const formatId = (index: number) => {
		return `${id}-${index}`;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderRadioButtons = () => {
		return (
			options.length > 0 &&
			options.map((option, index) => {
				const radioButtonId = formatId(index);

				return (
					<RadioContainer key={index}>
						<StyledRadioButton
							{...otherSchema}
							id={radioButtonId}
							data-testid={TestHelper.generateId(id, "radio")}
							disabled={disabled ?? option.disabled}
							name={option.label}
							value={option.value}
							checked={isRadioButtonChecked(option.value)}
							onChange={handleChange}
						/>
						<Label htmlFor={radioButtonId} disabled={disabled ?? option.disabled}>
							{option.label}
						</Label>
					</RadioContainer>
				);
			})
		);
	};

	const renderToggles = () => {
		return (
			options.length > 0 && (
				<ToggleWrapper>
					{options.map((option, index) => {
						const radioButtonId = formatId(index);

						return (
							<StyledToggle
								{...otherSchema}
								key={index}
								type="radio"
								id={radioButtonId}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								name={option.label}
								indicator={customOptions.styleType === "toggle" && customOptions?.indicator}
								styleType={
									customOptions.styleType === "toggle" && customOptions?.border === false
										? "no-border"
										: "default"
								}
								checked={isRadioButtonChecked(option.value)}
								onChange={(e) => handleChange(e, option.value)}
							>
								{option.label}
							</StyledToggle>
						);
					})}
				</ToggleWrapper>
			)
		);
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			{customOptions?.styleType === "toggle" ? renderToggles() : renderRadioButtons()}
		</Form.CustomField>
	);
};
