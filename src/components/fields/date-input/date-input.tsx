import { LocalDate } from "@js-joda/core";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared";
import { IDateInputSchema } from "./types";

export const DateInput = (props: IGenericFieldProps<IDateInputSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, useCurrentDate, dateFormat = "uuuu-MM-dd", validation, allowSoftValidation, ...otherSchema },
		id,
		onChange,
		value,
		error,
		...otherProps
	} = props;
	const [stateValue, setStateValue] = useState<string>(value || ""); // adheres to dateFormat
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const futureRule = validation?.find((rule) => "future" in rule);
		const pastRule = validation?.find((rule) => "past" in rule);
		const notFutureRule = validation?.find((rule) => "notFuture" in rule);
		const notPastRule = validation?.find((rule) => "notPast" in rule);

		setFieldValidationConfig(
			id,
			Yup.string()
				.test("is-date", "Invalid date", (value) => {
					if (!value || value === "") return true;
					const date = new Date(value);
					return !isNaN(date.valueOf());
				})
				.test("future", futureRule?.["errorMessage"] || ERROR_MESSAGES.DATE.MUST_BE_FUTURE, (value) => {
					if (!isValidDate(value) || !futureRule?.["future"]) return true;
					return LocalDate.parse(value).isAfter(LocalDate.now());
				})
				.test("past", pastRule?.["errorMessage"] || ERROR_MESSAGES.DATE.MUST_BE_PAST, (value) => {
					if (!isValidDate(value) || !pastRule?.["past"]) return true;
					return LocalDate.parse(value).isBefore(LocalDate.now());
				})
				.test(
					"not-future",
					notFutureRule?.["errorMessage"] || ERROR_MESSAGES.DATE.CANNOT_BE_FUTURE,
					(value) => {
						if (!isValidDate(value) || !notFutureRule?.["notFuture"]) return true;
						return !LocalDate.parse(value).isAfter(LocalDate.now());
					}
				)
				.test("not-past", notPastRule?.["errorMessage"] || ERROR_MESSAGES.DATE.CANNOT_BE_PAST, (value) => {
					if (!isValidDate(value) || !notPastRule?.["notPast"]) return true;
					return !LocalDate.parse(value).isBefore(LocalDate.now());
				}),
			validation,
			allowSoftValidation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	/**
	 * update local state according to various scenarios
	 * - prepopulate with current date if useCurrentDate=true and no value provided (value can be set via defaultValues)
	 * - if value is provided, store it in the intended format
	 * - otherwise if value cannot be parsed, clear both local state and registered value
	 */
	useEffect(() => {
		if (!dateFormat) return;

		if (useCurrentDate && !value) {
			const currentDate = DateTimeHelper.formatDateTime(LocalDate.now().toString(), dateFormat, "date");
			onChange({ target: { value: currentDate } });
			setStateValue(currentDate);
		} else if (!isValidDate(value)) {
			setStateValue(ERROR_MESSAGES.DATE.INVALID);
		} else {
			setStateValue(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCurrentDate, value, dateFormat]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = ([day, month, year]: string[]) => {
		if (!day && !month && !year) {
			onChange({
				target: { value: undefined },
			});
		} else if (day.length < 2 || month.length < 2 || year.length < 4) {
			onChange({
				target: { value: ERROR_MESSAGES.DATE.INVALID },
			});
		} else {
			onChange({
				target: {
					value: DateTimeHelper.formatDateTime(
						[year, month, day].join("-"),
						dateFormat,
						"date",
						ERROR_MESSAGES.DATE.INVALID
					),
				},
			});
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isValidDate = (value: string): boolean => {
		return value && value !== ERROR_MESSAGES.DATE.INVALID;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	return (
		<Form.DateInput
			{...otherSchema}
			{...otherProps}
			id={id}
			data-testid={TestHelper.generateId(id, "date")}
			label={label}
			errorMessage={error?.message}
			onChangeRaw={handleChange}
			value={stateValue}
		/>
	);
};
