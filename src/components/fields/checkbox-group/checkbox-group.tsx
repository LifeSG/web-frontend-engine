import { Form } from "@lifesg/react-design-system/form";
import without from "lodash/without";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { ERROR_MESSAGES, Sanitize } from "../../shared";
import {
	CheckboxContainer,
	Label,
	StyledCheckbox,
	StyledToggle,
	ToggleSublabel,
	ToggleWrapper,
} from "./checkbox-group.styles";
import { ICheckboxGroupSchema, IToggleOption } from "./types";

export const CheckboxGroup = (props: IGenericFieldProps<ICheckboxGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		formattedLabel,
		error,
		id,
		onChange,
		schema: { customOptions, disabled, label: _label, options, validation, ...otherSchema },
		value,
	} = props;

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

	const formatId = (index: number): string => {
		return `${id}-${index}`;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderCheckboxes = () => {
		return (
			options.length > 0 &&
			options.map((option, index) => {
				const checkboxId = formatId(index);

				return (
					<CheckboxContainer key={index}>
						<StyledCheckbox
							{...otherSchema}
							data-testid={TestHelper.generateId(id, "checkbox")}
							id={checkboxId}
							disabled={disabled ?? option.disabled}
							name={checkboxId}
							value={option.value}
							checked={isCheckboxChecked(option.value)}
							onChange={() => handleChange(option.value)}
						/>
						<Label as="label" htmlFor={checkboxId} disabled={disabled ?? option.disabled}>
							<Sanitize>{option.label}</Sanitize>
						</Label>
					</CheckboxContainer>
				);
			})
		);
	};

	const renderToggles = () => {
		return (
			options.length > 0 &&
			customOptions.styleType === "toggle" && (
				<ToggleWrapper $layoutType={customOptions?.layoutType ?? "horizontal"}>
					{options.map((option, index) => {
						const checkboxId = formatId(index);

						return (
							<StyledToggle
								key={index}
								{...otherSchema}
								type="checkbox"
								data-testid={TestHelper.generateId(id, "toggle")}
								id={checkboxId}
								disabled={disabled ?? option.disabled}
								name={checkboxId}
								indicator={customOptions?.indicator}
								styleType={customOptions?.border === false ? "no-border" : "default"}
								checked={isCheckboxChecked(option.value)}
								onChange={() => handleChange(option.value, option.none)}
								error={!!error?.message}
								subLabel={() =>
									option.children ? (
										<ToggleSublabel>
											<Wrapper>{option.children}</Wrapper>
										</ToggleSublabel>
									) : null
								}
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
		<Form.CustomField id={id} label={formattedLabel} errorMessage={error?.message}>
			{customOptions?.styleType === "toggle" ? renderToggles() : renderCheckboxes()}
		</Form.CustomField>
	);
};
