import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IGenericFieldProps } from "../types";
import { IDateFieldSchema } from "./types";

const DEFAULT_DATE_FORMAT = "uuuu-MM-dd";
const DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)
	.withResolverStyle(ResolverStyle.STRICT)
	.withLocale(Locale.ENGLISH);

export const DateField = (props: IGenericFieldProps<IDateFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		isDirty,
		onChange,
		schema: { label: _label, useCurrentDate, dateFormat = DEFAULT_DATE_FORMAT, validation, ...otherSchema },
		value,
		warning,
		...otherProps
	} = props;
	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || ""); // always uuuu-MM-dd because it is passed to Form.DateInput
	const [derivedProps, setDerivedProps] = useState<Pick<DateInputProps, "minDate" | "maxDate" | "disabledDates">>();
	const [isInteracted, setIsInteracted] = useState<boolean>(false);
	const { setFieldValidationConfig } = useValidationConfig();
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const dateFormatRule = validation?.find((rule) => "dateFormat" in rule && rule.dateFormat);
		const futureRule = validation?.find((rule) => "future" in rule);
		const pastRule = validation?.find((rule) => "past" in rule);
		const notFutureRule = validation?.find((rule) => "notFuture" in rule);
		const notPastRule = validation?.find((rule) => "notPast" in rule);
		const minDateRule = validation?.find((rule) => "minDate" in rule);
		const maxDateRule = validation?.find((rule) => "maxDate" in rule);
		const excludedDatesRule = validation?.find((rule) => "excludedDates" in rule);
		const withinDaysRule = validation?.find((rule) => "withinDays" in rule);
		const beyondDaysRule = validation?.find((rule) => "beyondDays" in rule);
		// determine the min date by parsing the value with the current date format
		const minDate = DateTimeHelper.toLocalDateOrTime(minDateRule?.["minDate"], dateFormat, "date");
		const maxDate = DateTimeHelper.toLocalDateOrTime(maxDateRule?.["maxDate"], dateFormat, "date");

		setFieldValidationConfig(
			id,
			Yup.string()
				.test("is-date", dateFormatRule?.errorMessage || ERROR_MESSAGES.DATE.INVALID, (value) => {
					if (!value || value === "") return true;
					if (!isValidDate(value)) return false;
					return !!DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
				})
				.test("future", futureRule?.errorMessage || ERROR_MESSAGES.DATE.MUST_BE_FUTURE, (value) => {
					if (!isValidDate(value) || !futureRule?.["future"]) return true;
					const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
					return !!localDate?.isAfter(LocalDate.now());
				})
				.test("past", pastRule?.errorMessage || ERROR_MESSAGES.DATE.MUST_BE_PAST, (value) => {
					if (!isValidDate(value) || !pastRule?.["past"]) return true;
					const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
					return !!localDate?.isBefore(LocalDate.now());
				})
				.test("not-future", notFutureRule?.errorMessage || ERROR_MESSAGES.DATE.CANNOT_BE_FUTURE, (value) => {
					if (!isValidDate(value) || !notFutureRule?.["notFuture"]) return true;
					const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
					return !localDate?.isAfter(LocalDate.now());
				})
				.test("not-past", notPastRule?.errorMessage || ERROR_MESSAGES.DATE.CANNOT_BE_PAST, (value) => {
					if (!isValidDate(value) || !notPastRule?.["notPast"]) return true;
					const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
					return !localDate?.isBefore(LocalDate.now());
				})
				.test(
					"min-date",
					minDateRule?.errorMessage ||
						ERROR_MESSAGES.DATE.MIN_DATE(
							DateTimeHelper.formatDateTime(minDateRule?.["minDate"], "dd/MM/uuuu", "date")
						),
					(value) => {
						if (!isValidDate(value) || !minDate) return true;
						const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
						return !localDate?.isBefore(minDate);
					}
				)
				.test(
					"max-date",
					maxDateRule?.errorMessage ||
						ERROR_MESSAGES.DATE.MAX_DATE(
							DateTimeHelper.formatDateTime(maxDateRule?.["maxDate"], "dd/MM/uuuu", "date")
						),
					(value) => {
						if (!isValidDate(value) || !maxDate) return true;
						const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
						return !localDate?.isAfter(maxDate);
					}
				)
				.test(
					"excluded-dates",
					excludedDatesRule?.errorMessage || ERROR_MESSAGES.DATE.DISABLED_DATES,
					(value) => {
						if (!isValidDate(value) || !excludedDatesRule) return true;
						return !excludedDatesRule["excludedDates"].includes(value);
					}
				)
				.test(
					"within-days",
					withinDaysRule?.errorMessage ||
						(withinDaysRule?.["withinDays"] &&
							ERROR_MESSAGES.DATE.WITHIN_DAYS(withinDaysRule?.["withinDays"])),
					(value) => {
						if (!isValidDate(value) || !withinDaysRule) return true;
						return DateTimeHelper.checkWithinDays(value, { ...withinDaysRule["withinDays"], dateFormat });
					}
				)
				.test(
					"beyond-days",
					beyondDaysRule?.errorMessage ||
						(beyondDaysRule?.["beyondDays"] &&
							ERROR_MESSAGES.DATE.BEYOND_DAYS(beyondDaysRule?.["beyondDays"])),
					(value) => {
						if (!isValidDate(value) || !beyondDaysRule) return true;
						return DateTimeHelper.checkBeyondDays(value, { ...beyondDaysRule["beyondDays"], dateFormat });
					}
				),
			validation
		);

		// set minDate / maxDate / disabledDates props
		const withinDaysRange =
			withinDaysRule?.["withinDays"] &&
			DateTimeHelper.calculateDisabledWithinDaysRange({ ...withinDaysRule["withinDays"], dateFormat });
		const beyondDaysRange =
			beyondDaysRule?.["beyondDays"] &&
			DateTimeHelper.calculateDisabledBeyondDaysRange({ ...beyondDaysRule["beyondDays"], dateFormat });

		const minDateProp = getLatestDate([
			minDate,
			futureRule?.["future"] && LocalDate.now().plusDays(1),
			notPastRule?.["notPast"] && LocalDate.now(),
			withinDaysRange?.startDate,
			beyondDaysRange?.startDate,
		]);
		const maxDateProp = getEarliestDate([
			maxDate,
			pastRule?.["past"] && LocalDate.now().minusDays(1),
			notFutureRule?.["notFuture"] && LocalDate.now(),
			withinDaysRange?.endDate,
			beyondDaysRange?.endDate,
		]);
		const disabledDatesProps = [...(excludedDatesRule?.["excludedDates"] || [])];
		if (minDateProp || maxDateProp || disabledDatesProps) {
			setDerivedProps((props) => ({
				...props,
				minDate: minDateProp?.format(DEFAULT_DATE_FORMATTER),
				maxDate: maxDateProp?.format(DEFAULT_DATE_FORMATTER),
				disabledDates: disabledDatesProps,
			}));
		}
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

		if (!value) {
			if (!isInteracted) {
				// runs on mount and reset
				if (useCurrentDate) {
					const currentDate = DateTimeHelper.formatDateTime(LocalDate.now().toString(), dateFormat, "date");
					setValue(id, currentDate);

					const inputDate = DateTimeHelper.formatDateTime(
						LocalDate.now().toString(),
						DEFAULT_DATE_FORMAT,
						"date"
					);
					setStateValue(inputDate);
				} else {
					setStateValue(undefined);
				}
			}
		} else if (!isValidDate(value)) {
			setStateValue(ERROR_MESSAGES.DATE.INVALID);
		} else {
			const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date"); // convert to LocalDate first to parse defaultValue
			setStateValue(
				DateTimeHelper.formatDateTime(
					localDate?.toString(),
					DEFAULT_DATE_FORMAT,
					"date",
					ERROR_MESSAGES.DATE.INVALID
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCurrentDate, value, dateFormat, isInteracted]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (value: string) => {
		setIsInteracted(true);
		onChange({
			target: {
				value: DateTimeHelper.formatDateTime(value, dateFormat, "date", ERROR_MESSAGES.DATE.INVALID),
			},
		});
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getEarliestDate = (localDates: LocalDate[]) =>
		localDates.filter((ld) => ld).sort((a, b) => (a.isAfter(b) ? 1 : -1))?.[0];

	const getLatestDate = (localDates: LocalDate[]) =>
		localDates.filter((ld) => ld).sort((a, b) => (a.isBefore(b) ? 1 : -1))?.[0];

	const isValidDate = (value: string): boolean => {
		return value && value !== ERROR_MESSAGES.DATE.INVALID;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	return (
		<>
			<Form.DateInput
				{...otherSchema}
				{...otherProps}
				{...derivedProps}
				id={id}
				data-testid={TestHelper.generateId(id, "date")}
				label={formattedLabel}
				errorMessage={error?.message}
				onChange={handleChange}
				value={stateValue}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
