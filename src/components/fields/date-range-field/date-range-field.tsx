import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { DateRangeInputProps } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { TDateRangeFieldSchema, TDateRangeInputType } from "./types";

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
	useEffect(() => {
		const dateFormatRule = validation?.find((rule) => "dateFormat" in rule && rule.dateFormat);
		const futureRule =
			appliedValidationRules.find((rule) => "future" in rule) || validation?.find((rule) => "future" in rule);
		const pastRule =
			appliedValidationRules.find((rule) => "past" in rule) || validation?.find((rule) => "past" in rule);
		const notFutureRule =
			appliedValidationRules.find((rule) => "notFuture" in rule) ||
			validation?.find((rule) => "notFuture" in rule);
		const notPastRule =
			appliedValidationRules.find((rule) => "notPast" in rule) || validation?.find((rule) => "notPast" in rule);
		const minDateRule =
			appliedValidationRules.find((rule) => "minDate" in rule) || validation?.find((rule) => "minDate" in rule);
		const maxDateRule =
			appliedValidationRules.find((rule) => "maxDate" in rule) || validation?.find((rule) => "maxDate" in rule);
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const excludedDatesRule =
			appliedValidationRules.find((rule) => "excludedDates" in rule) ||
			validation?.find((rule) => "excludedDates" in rule);
		const noOfDaysRule =
			appliedValidationRules.find((rule) => "numberOfDays" in rule) ||
			validation?.find((rule) => "numberOfDays" in rule);

		const minDate = DateTimeHelper.toLocalDateOrTime(minDateRule?.["minDate"], dateFormat, "date");
		const maxDate = DateTimeHelper.toLocalDateOrTime(maxDateRule?.["maxDate"], dateFormat, "date");
		const getMetaRules = (context: Yup.TestContext): Array<Record<string, unknown>> =>
			(context.schema.describe().meta?.rules as Array<Record<string, unknown>> | undefined) ?? [];
		const getMetaRule = (context: Yup.TestContext, key: string): unknown =>
			getMetaRules(context).find((rule) => key in rule)?.[key];
		const getMetaRuleErrorMessage = (context: Yup.TestContext, key: string): string | undefined =>
			getMetaRules(context).find((rule) => key in rule)?.errorMessage as string | undefined;

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
						setAppliedValidationRules(context.schema.describe().meta.rules);
						const requiredRuleFromMeta = getMetaRule(context, "required") as boolean | undefined;
						if (!value || (!isRequiredRule && !requiredRuleFromMeta)) return true;
						const isValid = value.from?.length > 0 && value.to?.length > 0;
						if (isValid) return true;
						return context.createError({
							message:
								isRequiredRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "required") ??
								ERROR_MESSAGES.DATE_RANGE.REQUIRED,
						});
					},
				})
				.test("is-date", dateFormatRule?.errorMessage || ERROR_MESSAGES.DATE_RANGE.INVALID, (value) => {
					if (isEmpty(value?.from) || isEmpty(value?.to)) return true;
					return (
						isValidDate(value.from) &&
						isValidDate(value.to) &&
						!!DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date") &&
						!!DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date")
					);
				})
				.test({
					name: "number-of-days",
					test(value, context) {
						if (variant === "week") return true;
						const effectiveNoOfDays =
							noOfDaysRule?.["numberOfDays"] ??
							(getMetaRule(context, "numberOfDays") as number | undefined);
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveNoOfDays) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid = localDateTo.equals(localDateFrom.plusDays(effectiveNoOfDays - 1));
						if (isValid) return true;
						return context.createError({
							message:
								noOfDaysRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "numberOfDays") ??
								ERROR_MESSAGES.DATE_RANGE.MUST_HAVE_NUMBER_OF_DAYS(effectiveNoOfDays),
						});
					},
				})
				.test({
					name: "future",
					test(value, context) {
						if (variant === "week") return true;
						if (
							!isValidDate(value.from) ||
							!isValidDate(value.to) ||
							(!futureRule?.["future"] && !(getMetaRule(context, "future") as boolean | undefined))
						)
							return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!!localDateFrom?.isAfter(LocalDate.now()) && !!localDateTo?.isAfter(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message:
								futureRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "future") ??
								ERROR_MESSAGES.DATE_RANGE.MUST_BE_FUTURE,
						});
					},
				})
				.test({
					name: "past",
					test(value, context) {
						if (variant === "week") return true;
						if (
							!isValidDate(value.from) ||
							!isValidDate(value.to) ||
							(!pastRule?.["past"] && !(getMetaRule(context, "past") as boolean | undefined))
						)
							return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!!localDateFrom?.isBefore(LocalDate.now()) && !!localDateTo?.isBefore(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message:
								pastRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "past") ??
								ERROR_MESSAGES.DATE_RANGE.MUST_BE_PAST,
						});
					},
				})
				.test({
					name: "not-future",
					test(value, context) {
						if (variant === "week") return true;
						if (
							!isValidDate(value.from) ||
							!isValidDate(value.to) ||
							(!notFutureRule?.["notFuture"] &&
								!(getMetaRule(context, "notFuture") as boolean | undefined))
						)
							return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isAfter(LocalDate.now()) && !localDateTo?.isAfter(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message:
								notFutureRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "notFuture") ??
								ERROR_MESSAGES.DATE_RANGE.CANNOT_BE_FUTURE,
						});
					},
				})
				.test({
					name: "not-past",
					test(value, context) {
						if (variant === "week") return true;
						if (
							!isValidDate(value.from) ||
							!isValidDate(value.to) ||
							(!notPastRule?.["notPast"] && !(getMetaRule(context, "notPast") as boolean | undefined))
						)
							return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isBefore(LocalDate.now()) && !localDateTo?.isBefore(LocalDate.now());
						if (isValid) return true;
						return context.createError({
							message:
								notPastRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "notPast") ??
								ERROR_MESSAGES.DATE_RANGE.CANNOT_BE_PAST,
						});
					},
				})
				.test({
					name: "min-date",
					test(value, context) {
						if (variant === "week") return true;
						const effectiveMinDateStr =
							minDateRule?.["minDate"] ?? (getMetaRule(context, "minDate") as string | undefined);
						const effectiveMinDate = effectiveMinDateStr
							? DateTimeHelper.toLocalDateOrTime(effectiveMinDateStr, dateFormat, "date")
							: minDate;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveMinDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isBefore(effectiveMinDate) && !localDateTo?.isBefore(effectiveMinDate);
						if (isValid) return true;
						return context.createError({
							message:
								minDateRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "minDate") ??
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
						const effectiveMaxDateStr =
							maxDateRule?.["maxDate"] ?? (getMetaRule(context, "maxDate") as string | undefined);
						const effectiveMaxDate = effectiveMaxDateStr
							? DateTimeHelper.toLocalDateOrTime(effectiveMaxDateStr, dateFormat, "date")
							: maxDate;
						if (!isValidDate(value.from) || !isValidDate(value.to) || !effectiveMaxDate) return true;
						const localDateFrom = DateTimeHelper.toLocalDateOrTime(value.from, dateFormat, "date");
						const localDateTo = DateTimeHelper.toLocalDateOrTime(value.to, dateFormat, "date");
						const isValid =
							!localDateFrom?.isAfter(effectiveMaxDate) && !localDateTo?.isAfter(effectiveMaxDate);
						if (isValid) return true;
						return context.createError({
							message:
								maxDateRule?.errorMessage ??
								getMetaRuleErrorMessage(context, "maxDate") ??
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
						const effectiveExcludedDates =
							excludedDatesRule?.["excludedDates"] ??
							(getMetaRule(context, "excludedDates") as string[] | undefined);
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
											excludedDatesRule?.errorMessage ??
											getMetaRuleErrorMessage(context, "excludedDates") ??
											ERROR_MESSAGES.DATE_RANGE.DISABLED_DATES,
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
		const staticProps: Partial<DateRangeInputProps> = {
			minDate: minDateProp?.format(DEFAULT_DATE_FORMATTER),
			maxDate: maxDateProp?.format(DEFAULT_DATE_FORMATTER),
			disabledDates: disabledDatesProps,
			numberOfDays: noOfDaysProp,
		};
		setDerivedProps((props) => ({
			...props,
			minDate: staticProps.minDate,
			maxDate: staticProps.maxDate,
			disabledDates: staticProps.disabledDates,
			numberOfDays: staticProps.numberOfDays,
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
