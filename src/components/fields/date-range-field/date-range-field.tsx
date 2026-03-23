import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { DateRangeInputProps } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IDateRangeFieldValidationRule, TDateRangeFieldSchema, TDateRangeInputType } from "./types";

const DEFAULT_DATE_FORMAT = "uuuu-MM-dd";
const DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)
	.withResolverStyle(ResolverStyle.STRICT)
	.withLocale(Locale.ENGLISH);

export const DateRangeField = (props: IGenericFieldProps<TDateRangeFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		isDirty,
		onChange,
		schema: { dateFormat = DEFAULT_DATE_FORMAT, label: _label, validation, variant, ...otherSchema },
		value = { from: undefined, to: undefined },
		warning,
		...otherProps
	} = props;
	const [stateValue, setStateValue] = useState<string>(value.from || ""); // always uuuu-MM-dd because it is passed to Form.DateInput
	const [stateValueEnd, setStateValueEnd] = useState<string>(value.to || ""); // always uuuu-MM-dd because it is passed to Form.DateInput
	const [derivedProps, setDerivedProps] = useState<DateRangeInputProps>();
	const { setFieldValidationConfig } = useValidationConfig();
	const [appliedValidationRules, setAppliedValidationRules] = useState<Record<string, any>[]>([]);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useDeepCompareEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.object()
				.shape({
					from: Yup.string(),
					to: Yup.string(),
				})
				.test({
					name: "is-empty-string",
					test(value, context) {
						setAppliedValidationRules(context.schema.describe().meta?.rules ?? []);
						const isRequiredRule = getAppliedRule(context.schema.describe().meta?.rules, "required");
						if (!value || !isRequiredRule) return true;
						const isValid = value.from?.length > 0 && value.to?.length > 0;
						if (isValid) return true;
						return context.createError({
							message: isRequiredRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.REQUIRED,
						});
					},
				})
				.test({
					name: "is-date",
					test(value, context) {
						const dateFormatRule = validation?.find(
							(rule) => !!rule && "dateFormat" in rule && rule.dateFormat
						);
						if (isEmpty(value?.from) || isEmpty(value?.to)) return true;
						const isValid =
							isValidDate(value.from) &&
							isValidDate(value.to) &&
							!!DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date") &&
							!!DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						if (isValid) return true;
						return context.createError({
							message: dateFormatRule?.errorMessage || ERROR_MESSAGES.DATE_RANGE.INVALID,
						});
					},
				})
				.test({
					name: "number-of-days",
					test(value, context) {
						if (variant === "week") return true;
						const noOfDaysRule = getAppliedRule(context.schema.describe().meta?.rules, "numberOfDays");
						const effectiveNoOfDays = noOfDaysRule?.numberOfDays;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveNoOfDays) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid = localDateTo.equals(localDateFrom.plusDays(effectiveNoOfDays - 1));
						if (isValid) return true;
						return context.createError({
							message:
								noOfDaysRule?.errorMessage ??
								ERROR_MESSAGES.DATE_RANGE.MUST_HAVE_NUMBER_OF_DAYS(effectiveNoOfDays),
						});
					},
				})
				.test({
					name: "future",
					test(value, context) {
						if (variant === "week") return true;
						const futureRule = getAppliedRule(context.schema.describe().meta?.rules, "future");
						if (!isValidDate(value.from) || !isValidDate(value.to) || !futureRule) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!!localDateFrom?.isAfter(LocalDate.now()) && !!localDateTo?.isAfter(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message: futureRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.MUST_BE_FUTURE,
						});
					},
				})
				.test({
					name: "past",
					test(value, context) {
						if (variant === "week") return true;
						const pastRule = getAppliedRule(context.schema.describe().meta?.rules, "past");
						if (!isValidDate(value.from) || !isValidDate(value.to) || !pastRule) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!!localDateFrom?.isBefore(LocalDate.now()) && !!localDateTo?.isBefore(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message: pastRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.MUST_BE_PAST,
						});
					},
				})
				.test({
					name: "not-future",
					test(value, context) {
						if (variant === "week") return true;
						const notFutureRule = getAppliedRule(context.schema.describe().meta?.rules, "notFuture");
						if (!isValidDate(value.from) || !isValidDate(value.to) || !notFutureRule) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isAfter(LocalDate.now()) && !localDateTo?.isAfter(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message: notFutureRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.CANNOT_BE_FUTURE,
						});
					},
				})
				.test({
					name: "not-past",
					test(value, context) {
						if (variant === "week") return true;
						const notPastRule = getAppliedRule(context.schema.describe().meta?.rules, "notPast");
						if (!isValidDate(value.from) || !isValidDate(value.to) || !notPastRule) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isBefore(LocalDate.now()) && !localDateTo?.isBefore(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message: notPastRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.CANNOT_BE_PAST,
						});
					},
				})
				.test({
					name: "min-date",
					test(value, context) {
						if (variant === "week") return true;
						const minDateRule = getAppliedRule(context.schema.describe().meta?.rules, "minDate");
						const effectiveMinDateStr = minDateRule?.minDate;
						const effectiveMinDate = effectiveMinDateStr
							? DateTimeHelper.toLocalDateOrTime(effectiveMinDateStr, dateFormat, "date")
							: undefined;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveMinDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isBefore(effectiveMinDate) && !localDateTo?.isBefore(effectiveMinDate);
						if (isValid) return true;
						return context.createError({
							message:
								minDateRule?.errorMessage ??
								ERROR_MESSAGES.DATE_RANGE.MIN_DATE(
									DateTimeHelper.formatDateTime(effectiveMinDateStr, "dd/MM/uuuu", "date")
								),
						});
					},
				})
				.test({
					name: "max-date",
					test(value, context) {
						if (variant === "week") return true;
						const maxDateRule = getAppliedRule(context.schema.describe().meta?.rules, "maxDate");
						const effectiveMaxDateStr = maxDateRule?.maxDate;
						const effectiveMaxDate = effectiveMaxDateStr
							? DateTimeHelper.toLocalDateOrTime(effectiveMaxDateStr, dateFormat, "date")
							: undefined;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveMaxDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isAfter(effectiveMaxDate) && !localDateTo?.isAfter(effectiveMaxDate);
						if (isValid) return true;
						return context.createError({
							message:
								maxDateRule?.errorMessage ??
								ERROR_MESSAGES.DATE_RANGE.MAX_DATE(
									DateTimeHelper.formatDateTime(effectiveMaxDateStr, "dd/MM/uuuu", "date")
								),
						});
					},
				})
				.test({
					name: "excluded-dates",
					test(value, context) {
						if (variant === "week") return true;
						const excludedDatesRule = getAppliedRule(
							context.schema.describe().meta?.rules,
							"excludedDates"
						);
						const effectiveExcludedDates = excludedDatesRule?.excludedDates;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveExcludedDates) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						try {
							const mappedexcludedDates = effectiveExcludedDates.map((date) =>
								DateTimeHelper.toLocalDateOrTime(date, dateFormat, "date")
							);
							for (const excludedDate of mappedexcludedDates) {
								if (localDateFrom.isEqual(excludedDate) || localDateTo.isEqual(excludedDate))
									return context.createError({
										message:
											excludedDatesRule?.errorMessage ?? ERROR_MESSAGES.DATE_RANGE.DISABLED_DATES,
									});
							}
							return true;
						} catch {
							return false;
						}
					},
				}),
			validation
		);

		// set minDate / maxDate / disabledDates props

		const futureRule = getAppliedRule(appliedValidationRules, "future");
		const pastRule = getAppliedRule(appliedValidationRules, "past");
		const notFutureRule = getAppliedRule(appliedValidationRules, "notFuture");
		const notPastRule = getAppliedRule(appliedValidationRules, "notPast");
		const minDateRule = getAppliedRule(appliedValidationRules, "minDate");
		const maxDateRule = getAppliedRule(appliedValidationRules, "maxDate");
		const excludedDatesRule = getAppliedRule(appliedValidationRules, "excludedDates");
		const noOfDaysRule = getAppliedRule(appliedValidationRules, "numberOfDays");
		const minDate = DateTimeHelper.toLocalDateOrTime(minDateRule?.["minDate"], dateFormat, "date");
		const maxDate = DateTimeHelper.toLocalDateOrTime(maxDateRule?.["maxDate"], dateFormat, "date");
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
		const noOfDaysProp = noOfDaysRule?.["numberOfDays"];
		setDerivedProps((props) => ({
			...props,
			minDate: minDateProp?.format(DEFAULT_DATE_FORMATTER),
			maxDate: maxDateProp?.format(DEFAULT_DATE_FORMATTER),
			disabledDates: disabledDatesProps,
			numberOfDays: noOfDaysProp,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, appliedValidationRules]);

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

	const getAppliedRule = (
		appliedRules: IDateRangeFieldValidationRule[],
		key: string
	): IDateRangeFieldValidationRule | undefined => {
		const metaRule = appliedRules?.find((rule: IDateRangeFieldValidationRule) => key in rule);
		const validationRule = validation?.find((rule) => !!rule && key in rule);
		if (!isEmpty(metaRule)) return metaRule;
		else if (!isEmpty(validationRule)) return validationRule;
		return undefined;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.DateRangeInput
				{...otherSchema}
				{...otherProps}
				{...derivedProps}
				id={id}
				data-testid={TestHelper.generateId(id, "date")}
				label={formattedLabel}
				errorMessage={error?.message}
				onChange={handleChange}
				value={stateValue}
				valueEnd={stateValueEnd}
				variant={variant}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
