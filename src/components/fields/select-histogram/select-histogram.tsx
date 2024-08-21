import { Form } from "@lifesg/react-design-system/form";
import isNil from "lodash/isNil";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { ISelectHistogramSchema } from "./types";

export const SelectHistogram = (props: IGenericFieldProps<ISelectHistogramSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { label: _label, validation, disabled, readOnly, className, histogramSlider, customOptions },
		value,
		warning,
		...otherProps
	} = props;
	console.log("a----", props);
	const { bins, interval } = histogramSlider;
	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<[number, number]>([0, 0]);
	const { setFieldValidationConfig } = useValidationConfig();
	// =============================================================================
	// EFFECTS
	// =============================================================================

	useEffect(() => {
		// prepopulate with full range selected if range is not selected
		if (!value) {
			const min = Math.min(...bins.map((bin) => bin.minValue));
			const max = Math.max(...bins.map((bin) => bin.minValue)) + interval;

			setValue(id, { from: min, to: max }, { shouldDirty: false });
			setStateValue([min, max]);
		} else {
			setStateValue([value.from, value.to]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const isBinRule = validation?.find((rule) => "bin" in rule && rule.bin);
		const isIncrementalRule = validation?.find((rule) => "incremental" in rule && rule.incremental);
		const isWithinRangeRule = validation?.find((rule) => "withinRange" in rule && rule.withinRange);

		setFieldValidationConfig(
			id,
			Yup.object({
				from: Yup.number(),
				to: Yup.number(),
			})
				.test(
					"is-required",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.REQUIRED_OPTIONS,
					(value) => {
						if (!value || !isRequiredRule) return true;
						return !isNil(value.from) && !isNil(value.to);
					}
				)
				.test("is-bin", isBinRule?.errorMessage || ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL, (value) => {
					if (!value || typeof value.from !== "number" || typeof value.to !== "number") return true;
					const { from, to } = value;
					const min = Math.min(...bins.map((bin) => bin.minValue));
					return Number.isInteger((from - min) / interval) && Number.isInteger((to - min) / interval);
				})
				.test(
					"is-incremental",
					isIncrementalRule?.errorMessage || ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL,
					(value) => {
						if (!value || typeof value.from !== "number" || typeof value.to !== "number") return true;
						return value.from < value.to;
					}
				)
				.test(
					"is-within-range",
					isWithinRangeRule?.errorMessage || ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL,
					(value) => {
						if (!value || typeof value.from !== "number" || typeof value.to !== "number") return true;

						const { from, to } = value;
						const min = Math.min(...bins.map((bin) => bin.minValue));
						const max = Math.max(...bins.map((bin) => bin.minValue)) + interval;

						if (from < min || to > max) {
							return false;
						}
						return true;
					}
				),
			validation
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, bins, interval]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================

	const handleChangeEnd = (value: [number, number]): void => {
		const [from, to] = value;
		onChange({ target: { value: { from, to } } });
	};
	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.SelectHistogram
				{...otherProps}
				id={id}
				data-testid={TestHelper.generateId(id, "select-histogram")}
				label={formattedLabel}
				errorMessage={error?.message}
				onChangeEnd={handleChangeEnd}
				disabled={disabled}
				readOnly={readOnly}
				className={className}
				rangeLabelPrefix={customOptions?.rangeLabelPrefix}
				rangeLabelSuffix={customOptions?.rangeLabelSuffix}
				value={stateValue}
				histogramSlider={{
					bins,
					interval,
				}}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
