import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { Form } from "@lifesg/react-design-system/form";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared";
import { IDateRangeFieldSchema, TDateRangeInputType } from "./types";

const DEFAULT_DATE_FORMAT = "uuuu-MM-dd";
const DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)
	.withResolverStyle(ResolverStyle.STRICT)
	.withLocale(Locale.ENGLISH);

export const DateRangeField = (props: IGenericFieldProps<IDateRangeFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, dateFormat = DEFAULT_DATE_FORMAT, validation, variant, ...otherSchema },
		id,
		isDirty,
		onChange,
		value = { from: undefined, to: undefined },
		error,
		...otherProps
	} = props;
	const [stateValue, setStateValue] = useState<string>(value.from || ""); // always uuuu-MM-dd because it is passed to Form.DateInput
	const [stateValueEnd, setStateValueEnd] = useState<string>(value.to || ""); // always uuuu-MM-dd because it is passed to Form.DateInput
	const [derivedProps, setDerivedProps] = useState<DateInputProps>();
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const futureRule = validation?.find((rule) => "future" in rule);
		const pastRule = validation?.find((rule) => "past" in rule);
		const notFutureRule = validation?.find((rule) => "notFuture" in rule);
		const notPastRule = validation?.find((rule) => "notPast" in rule);
		const minDateRule = validation?.find((rule) => "minDate" in rule);
		const maxDateRule = validation?.find((rule) => "maxDate" in rule);
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const excludedDatesRule = validation?.find((rule) => "excludedDates" in rule);

		const minDate = DateTimeHelper.toLocalDateOrTime(minDateRule?.["minDate"], dateFormat, "date");
		const maxDate = DateTimeHelper.toLocalDateOrTime(maxDateRule?.["maxDate"], dateFormat, "date");

		setFieldValidationConfig(
			id,
			Yup.object()
				.shape({
					from: Yup.string(),
					to: Yup.string(),
				})
				.test(
					"is-empty-string",
					isRequiredRule?.["errorMessage"] || ERROR_MESSAGES.DATE_RANGE.REQUIRED,
					(value) => {
						if (!value || !isRequiredRule) return true;
						return value.from?.length > 0 && value.to?.length > 0;
					}
				)
				.test("is-date", ERROR_MESSAGES.DATE_RANGE.INVALID, (value) => {
					if (isEmpty(value?.from) || isEmpty(value?.to)) return true;
					return (
						isValidDate(value.from) &&
						isValidDate(value.to) &&
						!!DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date") &&
						!!DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date")
					);
				})
				.test("future", futureRule?.["errorMessage"] || ERROR_MESSAGES.DATE_RANGE.MUST_BE_FUTURE, (value) => {
					if (variant === "week") return true;
					if (!isValidDate(value.from) || !isValidDate(value.to) || !futureRule?.["future"]) return true;
					const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
					const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
					return !!localDateFrom?.isAfter(LocalDate.now()) && !!localDateTo?.isAfter(LocalDate.now());
				})
				.test("past", pastRule?.["errorMessage"] || ERROR_MESSAGES.DATE_RANGE.MUST_BE_PAST, (value) => {
					if (variant === "week") return true;
					if (!isValidDate(value.from) || !isValidDate(value.to) || !pastRule?.["past"]) return true;
					const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
					const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
					return !!localDateFrom?.isBefore(LocalDate.now()) && !!localDateTo?.isBefore(LocalDate.now());
				})
				.test(
					"min-date",
					minDateRule?.["errorMessage"] ||
						ERROR_MESSAGES.DATE_RANGE.MIN_DATE(
							DateTimeHelper.formatDateTime(minDateRule?.["minDate"], "dd/MM/uuuu", "date")
						),
					(value) => {
						if (variant === "week") return true;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !minDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						return !localDateFrom?.isBefore(minDate) && !localDateTo?.isBefore(minDate);
					}
				)
				.test(
					"max-date",
					maxDateRule?.["errorMessage"] ||
						ERROR_MESSAGES.DATE_RANGE.MAX_DATE(
							DateTimeHelper.formatDateTime(maxDateRule?.["maxDate"], "dd/MM/uuuu", "date")
						),
					(value) => {
						if (variant === "week") return true;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !maxDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						return !localDateFrom?.isAfter(maxDate) && !localDateTo?.isAfter(maxDate);
					}
				)
				.test(
					"excluded-dates",
					excludedDatesRule?.["errorMessage"] || ERROR_MESSAGES.DATE_RANGE.DISABLED_DATES,
					(value) => {
						if (variant === "week") return true;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !excludedDatesRule) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						try {
							const mappedexcludedDates = excludedDatesRule["excludedDates"].map((date) =>
								DateTimeHelper.toLocalDateOrTime(date, dateFormat, "date")
							);
							for (const excludedDate of mappedexcludedDates) {
								if (localDateFrom.isEqual(excludedDate) || localDateTo.isEqual(excludedDate))
									return false;
							}
							return true;
						} catch {
							return false;
						}
					}
				),
			validation
		);

		// set minDate / maxDate / disabledDates props
		const minDateProp = getLatestDate([
			minDate,
			futureRule?.["future"] && LocalDate.now().plusDays(1),
			notPastRule?.["notPast"] && LocalDate.now(),
		]);
		const maxDateProp = getEarliestDate([
			maxDate,
			pastRule?.["past"] && LocalDate.now().minusDays(1),
			notFutureRule?.["notFuture"] && LocalDate.now(),
		]);
		const disabledDatesProps = excludedDatesRule?.["excludedDates"];
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
		setState(TDateRangeInputType.START);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value.from, dateFormat, isDirty]);

	useEffect(() => {
		setState(TDateRangeInputType.END);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value.to, dateFormat, isDirty]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = (startDate: string, endDate: string) => {
		onChange({
			target: {
				value: {
					from: DateTimeHelper.formatDateTime(
						startDate,
						dateFormat,
						"date",
						ERROR_MESSAGES.DATE_RANGE.INVALID
					),
					to: DateTimeHelper.formatDateTime(endDate, dateFormat, "date", ERROR_MESSAGES.DATE_RANGE.INVALID),
				},
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
		return value && value !== ERROR_MESSAGES.DATE_RANGE.INVALID;
	};

	const setState = (type: TDateRangeInputType) => {
		const currentValue = type === TDateRangeInputType.START ? value.from : value.to;
		const setStateFn = type === TDateRangeInputType.START ? setStateValue : setStateValueEnd;
		if (!dateFormat) return;

		if (!currentValue) {
			if (!isDirty) {
				// runs on mount and reset
				setStateFn(undefined);
			}
		} else if (!isValidDate(currentValue)) {
			setStateFn(ERROR_MESSAGES.DATE_RANGE.INVALID);
		} else {
			const localDate = DateTimeHelper.toLocalDateOrTime(currentValue, dateFormat, "date"); // convert to LocalDate first to parse defaultValue
			setStateFn(
				DateTimeHelper.formatDateTime(
					localDate?.toString(),
					DEFAULT_DATE_FORMAT,
					"date",
					ERROR_MESSAGES.DATE_RANGE.INVALID
				)
			);
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	return (
		<Form.DateRangeInput
			{...otherSchema}
			{...otherProps}
			{...derivedProps}
			id={id}
			data-testid={TestHelper.generateId(id, "date")}
			label={label}
			errorMessage={error?.message}
			onChange={handleChange}
			value={stateValue}
			valueEnd={stateValueEnd}
			variant={variant}
		/>
	);
};
