import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { Sanitize, Warning } from "../../shared";
import {
	FlexImageWrapper,
	FlexToggleWrapper,
	Label,
	RadioContainer,
	StyledImageButton,
	StyledRadioButton,
	StyledToggle,
} from "./radio-button.styles";
import { IRadioButtonOption, TRadioButtonGroupSchema } from "./types";

export const RadioButtonGroup = (props: IGenericFieldProps<TRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { className, customOptions, disabled, label: _label, options, validation, ...otherSchema },
		value,
		warning,
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
	const handleChangeOrClick = (value: string): void => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isRadioButtonChecked = (value: string): boolean => {
		return stateValue === value;
	};

	const formatId = () => {
		const unique = generateRandomId();
		return `${id}-${unique}`;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderLabel = (label: IRadioButtonOption["label"]) => {
		if (typeof label === "string") {
			return <Sanitize inline>{label}</Sanitize>;
		}
		return <Wrapper>{label}</Wrapper>;
	};

	const renderRadioButtons = () => {
		return (
			options.length > 0 &&
			options.map((option, index) => {
				const radioButtonId = formatId();

				return (
					<RadioContainer className={className ? `${className}-radio-container` : undefined} key={index}>
						<StyledRadioButton
							{...otherSchema}
							className={className}
							id={radioButtonId}
							data-testid={TestHelper.generateId(id, "radio")}
							disabled={disabled ?? option.disabled}
							name={radioButtonId}
							value={option.value}
							checked={isRadioButtonChecked(option.value)}
							onChange={() => handleChangeOrClick(option.value)}
						/>
						<Label as="label" htmlFor={radioButtonId} disabled={disabled ?? option.disabled}>
							{renderLabel(option.label)}
						</Label>
					</RadioContainer>
				);
			})
		);
	};

	const renderToggles = () => {
		return (
			options.length > 0 &&
			customOptions.styleType === "toggle" && (
				<FlexToggleWrapper
					className={className ? `${className} ${className}-radio-container` : undefined}
					$layoutType={customOptions?.layoutType ?? "horizontal"}
				>
					{options.map((option, index) => {
						const radioButtonId = formatId();

						return (
							<StyledToggle
								{...otherSchema}
								key={index}
								type="radio"
								id={radioButtonId}
								className={className ? `${className}-radio` : undefined}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								name={radioButtonId}
								indicator={customOptions?.indicator}
								styleType={customOptions?.border === false ? "no-border" : "default"}
								checked={isRadioButtonChecked(option.value)}
								onChange={() => handleChangeOrClick(option.value)}
								error={!!error?.message}
								compositeSection={
									option.children
										? {
												children: <Wrapper>{option.children}</Wrapper>,
												collapsible: false,
										  }
										: null
								}
								subLabel={!!option.subLabel && renderLabel(option.subLabel)}
							>
								{renderLabel(option.label)}
							</StyledToggle>
						);
					})}
				</FlexToggleWrapper>
			)
		);
	};

	const renderImageButtons = () => {
		return (
			options.length > 0 && (
				<FlexImageWrapper className={className ? `${className} ${className}-radio-container` : undefined}>
					{options.map((option, index) => {
						const radioButtonId = formatId();

						return (
							<StyledImageButton
								// temp any fix until proper typing is created
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								{...(otherSchema as any)}
								type="button"
								key={index}
								id={radioButtonId}
								className={className ? `${className}-radio` : undefined}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								name={radioButtonId}
								selected={isRadioButtonChecked(option.value)}
								onClick={() => handleChangeOrClick(option.value)}
								imgSrc={option.imgSrc}
								error={!!error?.message}
							>
								{option.label}
							</StyledImageButton>
						);
					})}
				</FlexImageWrapper>
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
		<>
			<Form.CustomField id={id} label={formattedLabel} errorMessage={error?.message}>
				{renderOptions()}
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
