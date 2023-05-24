import { Form } from "@lifesg/react-design-system/form";
import { Toggle } from "@lifesg/react-design-system/toggle";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Label, RadioContainer, StyledRadioButton, FlexWrapper, StyledImageButton } from "./radio-button.styles";
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
	const handleChangeOrClick = (
		event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
		value?: string
	): void => {
		value ?? setStateValue(value);
		value ? onChange({ target: { value } }) : onChange(event);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isRadioButtonChecked = (value: string): boolean => {
		return stateValue === value;
	};

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
							onChange={handleChangeOrClick}
						/>
						<Label as="label" htmlFor={radioButtonId} disabled={disabled ?? option.disabled}>
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
				<FlexWrapper>
					{options.map((option, index) => {
						const radioButtonId = formatId(index);

						return (
							<Toggle
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
								onChange={(e) => handleChangeOrClick(e, option.value)}
							>
								{option.label}
							</Toggle>
						);
					})}
				</FlexWrapper>
			)
		);
	};

	const renderImageButtons = () => {
		return (
			options.length > 0 && (
				<FlexWrapper>
					{options.map((option, index) => {
						const radioButtonId = formatId(index);

						return (
							<StyledImageButton
								{...otherSchema}
								type="button"
								key={index}
								id={radioButtonId}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								name={option.label}
								selected={isRadioButtonChecked(option.value)}
								onClick={(e) => handleChangeOrClick(e, option.value)}
								imgSrc={option.imgSrc}
							>
								{option.label}
							</StyledImageButton>
						);
					})}
				</FlexWrapper>
			)
		);
	};

	const renderOptions = () => {
		switch (customOptions?.styleType) {
			case "toggle":
				return renderToggles();
			case "image-button":
				return renderImageButtons();
			default:
				return renderRadioButtons();
		}
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			{renderOptions()}
		</Form.CustomField>
	);
};
