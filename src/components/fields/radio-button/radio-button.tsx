import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { Form } from "@lifesg/react-design-system/form";
import { Breakpoint } from "@lifesg/react-design-system/theme";
import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ThemeContext } from "styled-components";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper, filterSchemaProps, generateRandomId } from "../../../utils";
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
import {
	IImageButtonOption,
	IRadioButtonOption,
	IRadioToggleOption,
	TBreakpoint,
	TRadioButtonGroupSchema,
	TResponsiveValue,
} from "./types";

const DEFAULT_MIN_ITEM_WIDTH = 164;

const resolveResponsiveValue = <T,>(
	value: TResponsiveValue<T> | undefined,
	breakpoint: TBreakpoint,
	defaultValue: T
): T => {
	if (value === undefined || value === null) return defaultValue;
	if (typeof value !== "object") return value as T;
	const { mobile, tablet, desktop } = value as { mobile?: T; tablet?: T; desktop?: T };
	if (breakpoint === "mobile") return mobile ?? tablet ?? desktop ?? defaultValue;
	if (breakpoint === "tablet") return tablet ?? desktop ?? mobile ?? defaultValue;
	return desktop ?? tablet ?? mobile ?? defaultValue;
};

export const RadioButtonGroup = (props: IGenericFieldProps<TRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { error, formattedLabel, id, onChange, schema, value, warning } = props;
	const {
		commonSchema: { customOptions, validation },
		customSchema: { className, disabled, options, ...radioProps },
	} = filterSchemaProps(schema);

	const toggleOptions =
		customOptions && "styleType" in customOptions && customOptions.styleType === "toggle"
			? customOptions
			: undefined;

	const allowDeselection =
		toggleOptions && "allowDeselection" in schema
			? (schema as { allowDeselection?: boolean }).allowDeselection
			: undefined;

	const theme = useContext(ThemeContext);
	const { setValue, trigger, unregister } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || "");
	const [currentBreakpoint, setCurrentBreakpoint] = useState<TBreakpoint>("desktop");
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string().nullable(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		if (!options.find((option) => option.value === value)) {
			setValue(id, "");
		}
	}, [options]);

	useEffect(() => {
		setStateValue(value ?? "");
	}, [value]);

	useEffect(() => {
		const mobileMax = Breakpoint["sm-max"]({ theme });
		const tabletMax = Breakpoint["lg-max"]({ theme }) - 1;
		const mobileQuery = window.matchMedia(`(max-width: ${mobileMax}px)`);
		const tabletQuery = window.matchMedia(`(min-width: ${mobileMax + 1}px) and (max-width: ${tabletMax}px)`);

		const detectBreakpoint = (): TBreakpoint => {
			if (mobileQuery.matches) return "mobile";
			if (tabletQuery.matches) return "tablet";
			return "desktop";
		};

		const onQueryChange = () => setCurrentBreakpoint(detectBreakpoint());
		onQueryChange();
		mobileQuery.addEventListener("change", onQueryChange);
		tabletQuery.addEventListener("change", onQueryChange);
		return () => {
			mobileQuery.removeEventListener("change", onQueryChange);
			tabletQuery.removeEventListener("change", onQueryChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChangeOrClick = (clickedValue: string): void => {
		if (allowDeselection && stateValue === clickedValue) {
			handleDeselect(clickedValue);
		} else {
			onChange?.({ target: { value: clickedValue } });
			trigger(id);
		}
	};

	const handleDeselect = (clickedValue: string): void => {
		onChange?.({ target: { value: null } });
		trigger(id);

		const selectedOption = options.find((opt) => opt.value === clickedValue);
		if (
			selectedOption &&
			"children" in selectedOption &&
			isObject(selectedOption.children) &&
			!isEmpty(selectedOption.children)
		) {
			collectNestedChildIds(selectedOption.children as Record<string, unknown>).forEach((childId) => {
				removeFieldValidationConfig(childId);
				unregister(childId);
			});
		}
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

	const collectNestedChildIds = (children: Record<string, unknown>): string[] =>
		Object.entries(children).flatMap(([childId, child]) => {
			const nestedChildren = isObject(child) ? (child as Record<string, unknown>)["children"] : undefined;
			const nestedIds =
				isObject(nestedChildren) && !isEmpty(nestedChildren)
					? collectNestedChildIds(nestedChildren as Record<string, unknown>)
					: [];
			return [childId, ...nestedIds];
		});

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
							{...radioProps}
							className={className}
							id={radioButtonId}
							data-testid={TestHelper.generateId(id, "radio")}
							disabled={disabled ?? option.disabled}
							focusableWhenDisabled={disabled}
							name={radioButtonId}
							value={option.value}
							checked={isRadioButtonChecked(option.value)}
							onChange={() => handleChangeOrClick(option.value)}
						/>
						<Label forwardedAs="label" htmlFor={radioButtonId} disabled={disabled ?? option.disabled}>
							{renderLabel(option.label)}
						</Label>
					</RadioContainer>
				);
			})
		);
	};

	const renderToggles = () => {
		const layoutType = toggleOptions?.layoutType ?? "horizontal";
		const resolvedColumns =
			toggleOptions?.layoutColumns !== undefined
				? resolveResponsiveValue(toggleOptions.layoutColumns, currentBreakpoint, 0) || undefined
				: undefined;
		const resolvedMinItemWidth = resolveResponsiveValue(
			toggleOptions?.minItemWidth,
			currentBreakpoint,
			DEFAULT_MIN_ITEM_WIDTH
		);
		const stretch = toggleOptions?.stretch ?? false;

		return (
			options.length > 0 &&
			customOptions?.styleType === "toggle" && (
				<FlexToggleWrapper
					className={className ? `${className} ${className}-radio-container` : undefined}
					$layoutType={layoutType}
					$resolvedColumns={resolvedColumns}
					$resolvedMinItemWidth={resolvedMinItemWidth}
					$stretch={stretch}
					$hasMinItemWidth={!!toggleOptions?.minItemWidth}
				>
					{(options as IRadioToggleOption[]).map((option, index) => {
						const radioButtonId = formatId();

						return (
							<StyledToggle
								{...radioProps}
								key={index}
								type="radio"
								id={radioButtonId}
								className={className ? `${className}-radio` : undefined}
								data-testid={TestHelper.generateId(id, "radio")}
								disabled={disabled ?? option.disabled}
								focusableWhenDisabled={disabled}
								name={radioButtonId}
								indicator={customOptions?.indicator}
								styleType={customOptions?.border === false ? "no-border" : "default"}
								checked={isRadioButtonChecked(option.value)}
								onClick={() => handleChangeOrClick(option.value)}
								onKeyDown={(e) => {
									if (e.key === " " || e.key === "Enter") {
										e.preventDefault();
										handleChangeOrClick(option.value);
									}
								}}
								error={!!error?.message && (!stateValue || isRadioButtonChecked(option.value))}
								$hasError={!!error?.message && isRadioButtonChecked(option.value)}
								compositeSection={
									option.children && (!allowDeselection || isRadioButtonChecked(option.value))
										? { children: <Wrapper>{option.children}</Wrapper>, collapsible: false }
										: undefined
								}
								subLabel={option.subLabel ? renderLabel(option.subLabel) : undefined}
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
					{(options as IImageButtonOption[]).map((option, index) => {
						const radioButtonId = formatId();

						return (
							<StyledImageButton
								// temp any fix until proper typing is created
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								{...(radioProps as any)}
								type="button"
								key={index}
								id={radioButtonId}
								className={className ? `${className}-radio` : undefined}
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
				<div role="radiogroup" tabIndex={0}>
					{renderOptions()}
				</div>
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
