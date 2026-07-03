import { Form } from "@lifesg/react-design-system/form";
import { ImageButton } from "@lifesg/react-design-system/image-button";
import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper, filterSchemaProps, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { Sanitize, Warning } from "../../shared";
import * as styles from "./radio-button.styles";
import { IRadioButtonOption, TRadioButtonGroupSchema } from "./types";

export const RadioButtonGroup = (props: IGenericFieldProps<TRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { error, formattedLabel, id, onChange, schema, value, warning } = props;
	const {
		commonSchema: { customOptions, validation },
		customSchema: { className, disabled, options, ...radioProps },
	} = filterSchemaProps(schema);

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
		const isValidValue = value && options.find((option) => option.value === value);
		const newValue = isValidValue ? value : "";
		setValue(id, newValue);
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
					<div
						className={clsx(styles.radioContainer, className && `${className}-radio-container`)}
						key={index}
					>
						<RadioButton
							{...radioProps}
							className={clsx(styles.styledRadioButton, className)}
							id={radioButtonId}
							data-testid={TestHelper.generateId(id, "radio")}
							disabled={disabled ?? option.disabled}
							focusableWhenDisabled={disabled}
							name={radioButtonId}
							value={option.value}
							checked={isRadioButtonChecked(option.value)}
							onChange={() => handleChangeOrClick(option.value)}
						/>
						<Typography.BodyMD
							as="label"
							htmlFor={radioButtonId}
							className={clsx(styles.label, (disabled ?? option.disabled) && styles.labelDisabled)}
						>
							{renderLabel(option.label)}
						</Typography.BodyMD>
					</div>
				);
			})
		);
	};

	const renderToggles = () => {
		return (
			options.length > 0 &&
			customOptions.styleType === "toggle" && (
				<div
					className={clsx(
						styles.flexToggleWrapper,
						customOptions?.layoutType === "vertical" && styles.flexToggleWrapperVertical,
						className && `${className} ${className}-radio-container`
					)}
				>
					{options.map((option, index) => {
						const radioButtonId = formatId();

						return (
							<Toggle
								{...radioProps}
								key={index}
								type="radio"
								id={radioButtonId}
								className={clsx(styles.styledToggle, className && `${className}-radio`)}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								focusableWhenDisabled={disabled}
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
							</Toggle>
						);
					})}
				</div>
			)
		);
	};

	const renderImageButtons = () => {
		return (
			options.length > 0 && (
				<div
					className={clsx(styles.flexImageWrapper, className && `${className} ${className}-radio-container`)}
				>
					{options.map((option, index) => {
						const radioButtonId = formatId();

						return (
							<ImageButton
								// temp any fix until proper typing is created
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								{...(radioProps as any)}
								type="button"
								key={index}
								id={radioButtonId}
								className={clsx(styles.styledImageButton, className && `${className}-radio`)}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								focusableWhenDisabled={disabled}
								name={radioButtonId}
								selected={isRadioButtonChecked(option.value)}
								onClick={() => handleChangeOrClick(option.value)}
								imgSrc={option.imgSrc}
								error={!!error?.message}
							>
								{option.label}
							</ImageButton>
						);
					})}
				</div>
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
				<div role="radiogroup" tabIndex={0}>
					{renderOptions()}
				</div>
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
