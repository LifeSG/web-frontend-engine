import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Form } from "@lifesg/react-design-system/form";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import clsx from "clsx";
import without from "lodash/without";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper, filterSchemaProps, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { ERROR_MESSAGES, Sanitize, Warning } from "../../shared";
import * as styles from "./checkbox-group.styles";
import { ICheckboxGroupOption, IToggleOption, TCheckboxGroupSchema } from "./types";

export const CheckboxGroup = (props: IGenericFieldProps<TCheckboxGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { formattedLabel, error, id, onChange, schema, value, warning } = props;
	const {
		commonSchema: { customOptions, validation },
		customSchema: { className, disabled, options, ...checkboxProps },
	} = filterSchemaProps(schema);

	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const { setFieldValidationConfig } = useValidationConfig();

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

	useDeepCompareEffect(() => {
		const updatedValues = value?.filter((v) => options.find((option) => option.value === v));
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		setStateValue(value || []);
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: string, none?: boolean): void => {
		const nullOpt = options.find((opt: IToggleOption) => opt.none === true);
		let updatedStateValues = [...stateValue];
		if (none) {
			updatedStateValues = updatedStateValues.includes(value) ? [] : [value];
		} else if (updatedStateValues.includes(value)) {
			updatedStateValues = without(updatedStateValues, value, nullOpt?.value);
		} else {
			updatedStateValues.push(value);
			updatedStateValues = without(updatedStateValues, nullOpt?.value);
		}

		onChange({ target: { value: updatedStateValues } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isCheckboxChecked = (value: string): boolean => {
		return stateValue.includes(value);
	};

	const formatId = (): string => {
		const unique = generateRandomId();
		return `${id}-${unique}`;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderLabel = (label: ICheckboxGroupOption["label"]) => {
		if (typeof label === "string") {
			return <Sanitize inline>{label}</Sanitize>;
		}
		return <Wrapper>{label}</Wrapper>;
	};

	const renderCheckboxes = () => {
		return (
			options.length > 0 &&
			options.map((option, index) => {
				const checkboxId = formatId();

				return (
					<div
						key={index}
						className={clsx(
							styles.checkboxContainer,
							className ? `${className}-checkbox-container` : undefined
						)}
					>
						<Checkbox
							{...checkboxProps}
							data-testid={TestHelper.generateId(id, "checkbox")}
							id={checkboxId}
							className={clsx(styles.checkbox, className)}
							disabled={disabled ?? option.disabled}
							name={checkboxId}
							value={option.value}
							focusableWhenDisabled={disabled}
							checked={isCheckboxChecked(option.value)}
							onChange={() => handleChange(option.value)}
						/>
						<Typography.BodyMD
							as="label"
							htmlFor={checkboxId}
							className={clsx(styles.label, { [styles.labelDisabled]: disabled ?? option.disabled })}
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
						styles.toggleWrapper,
						customOptions?.layoutType === "vertical" && styles.toggleWrapperVertical,
						className ? `${className}-checkbox-container` : undefined
					)}
				>
					{options.map((option, index) => {
						const checkboxId = formatId();

						return (
							<Toggle
								key={index}
								type="checkbox"
								data-testid={TestHelper.generateId(id, "toggle")}
								id={checkboxId}
								className={clsx(styles.toggle, className)}
								disabled={disabled ?? option.disabled}
								focusableWhenDisabled={disabled}
								name={checkboxId}
								indicator={customOptions?.indicator}
								styleType={customOptions?.border === false ? "no-border" : "default"}
								checked={isCheckboxChecked(option.value)}
								onChange={() => handleChange(option.value, option.none)}
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

	return (
		<>
			<Form.CustomField id={id} label={formattedLabel} errorMessage={error?.message}>
				<div role="group">{customOptions?.styleType === "toggle" ? renderToggles() : renderCheckboxes()}</div>
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
