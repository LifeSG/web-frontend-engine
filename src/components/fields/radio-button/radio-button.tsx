import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { Form } from "@lifesg/react-design-system/form";
import { ImageButton } from "@lifesg/react-design-system/image-button";
import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import clsx from "clsx";
import { useApplyStyle, useMaxWidthMediaQuery } from "@lifesg/react-design-system/theme";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper, filterSchemaProps, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { Sanitize, Warning } from "../../shared";
import * as styles from "./radio-button.styles";
import {
	IImageButtonOption,
	IRadioButtonOption,
	IRadioToggleOption,
	TBreakpoint,
	TRadioButtonGroupSchema,
	TResponsiveBreakpointValue,
	TResponsiveValue,
} from "./types";

const DEFAULT_MIN_ITEM_WIDTH = 164;

const BREAKPOINT_ORDER: TBreakpoint[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];

const resolveResponsiveValue = <T,>(
	value: TResponsiveValue<T> | undefined,
	breakpoint: TBreakpoint,
	defaultValue: T
): T => {
	if (value === undefined || value === null) return defaultValue;
	if (typeof value !== "object") return value as T;
	const responsive = value as TResponsiveBreakpointValue<T>;
	const idx = BREAKPOINT_ORDER.indexOf(breakpoint);
	const searchOrder = BREAKPOINT_ORDER.slice(0, idx + 1).reverse();
	const resolved = searchOrder.find((bp) => responsive[bp] !== undefined);
	return resolved ? (responsive[resolved] as T) : defaultValue;
};

export const RadioButtonGroup = (props: IGenericFieldProps<TRadioButtonGroupSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { error, formattedLabel, id, onBlur, onChange, schema, value, warning } = props;
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

	const { setValue, clearErrors, unregister } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();
	const toggleWrapperRef = useRef<HTMLDivElement | null>(null);

	const breakpointMatches: [TBreakpoint, boolean][] = [
		["xxs", useMaxWidthMediaQuery("xxs")],
		["xs", useMaxWidthMediaQuery("xs")],
		["sm", useMaxWidthMediaQuery("sm")],
		["md", useMaxWidthMediaQuery("md")],
		["lg", useMaxWidthMediaQuery("lg")],
		["xl", useMaxWidthMediaQuery("xl")],
	];
	const currentBreakpoint: TBreakpoint = breakpointMatches.find(([, matches]) => matches)?.[0] ?? "xxl";

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
	const hasMinItemWidth = !!toggleOptions?.minItemWidth;

	const useGrid = !!(resolvedColumns || stretch);
	const wrapperTokens: Record<string, string | undefined> = {};
	if (resolvedColumns) wrapperTokens[styles.tokens.toggleWrapper.columns] = `${resolvedColumns}`;
	if (stretch || hasMinItemWidth) {
		wrapperTokens[styles.tokens.toggleWrapper.minItemWidth] = `${resolvedMinItemWidth}px`;
	}

	useApplyStyle(toggleWrapperRef, wrapperTokens);

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

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChangeOrClick = (clickedValue: string): void => {
		if (allowDeselection && stateValue === clickedValue) {
			handleDeselect(clickedValue);
		} else {
			onChange?.({ target: { value: clickedValue } });
			clearErrors(id);
		}
	};

	const handleDeselect = (clickedValue: string): void => {
		onChange?.({ target: { value: undefined } });

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

	const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
		const nextFocusedElement = event.relatedTarget as Node | null;
		if (nextFocusedElement && event.currentTarget.contains(nextFocusedElement)) {
			return;
		}
		onBlur?.();
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
			customOptions?.styleType === "toggle" && (
				<div
					ref={toggleWrapperRef}
					className={clsx(
						useGrid ? styles.gridToggleWrapper : styles.flexToggleWrapper,
						customOptions?.layoutType === "vertical" && styles.toggleWrapperVertical,
						error?.message && styles.toggleWrapperHasError,
						className && `${className} ${className}-radio-container`
					)}
					data-stretch={stretch || undefined}
				>
					{(options as IRadioToggleOption[]).map((option, index) => {
						const radioButtonId = formatId();

						return (
							<Toggle
								{...radioProps}
								key={index}
								type="radio"
								id={radioButtonId}
								className={clsx(
									styles.styledToggle,
									error?.message && styles.styledToggleHasError,
									className && `${className}-radio`
								)}
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
								error={!!error?.message}
								compositeSection={
									option.children && (!allowDeselection || isRadioButtonChecked(option.value))
										? { children: <Wrapper>{option.children}</Wrapper>, collapsible: false }
										: undefined
								}
								subLabel={option.subLabel ? renderLabel(option.subLabel) : undefined}
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
					{(options as IImageButtonOption[]).map((option, index) => {
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
				<div role="radiogroup" tabIndex={0} onBlur={handleBlur}>
					{renderOptions()}
				</div>
			</Form.CustomField>
			<Warning id={id} message={warning} />
		</>
	);
};
