import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { DateRangeInputProps } from "@lifesg/react-design-system/date-range-input";
import { Form } from "@lifesg/react-design-system/form";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { YupHelper } from "../../../context-providers";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useFormValues, useValidationConfig } from "../../../utils/hooks";
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
	const staticDerivedPropsRef = useRef<Partial<DateRangeInputProps>>({});
	const { formValidationConfig, setFieldValidationConfig } = useValidationConfig();
	const { formValues } = useFormValues();

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
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const excludedDatesRule = validation?.find((rule) => "excludedDates" in rule);
		const noOfDaysRule = validation?.find((rule) => "numberOfDays" in rule);

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
		staticDerivedPropsRef.current = staticProps;
		if (minDateProp || maxDateProp || disabledDatesProps || noOfDaysProp) {
			setDerivedProps((props) => ({
				...props,
				minDate: staticProps.minDate,
				maxDate: staticProps.maxDate,
				disabledDates: staticProps.disabledDates,
				numberOfDays: staticProps.numberOfDays,
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		const currentValues = (formValues ?? {}) as Record<string, unknown>;

		// Only run if any when rules for UI-affecting props exist in the schema
		const whenRulesForDerivedProps = (validation ?? []).filter(
			(rule) =>
				rule?.when &&
				Object.values(rule.when).some((cond) =>
					cond.then?.some(
						(r): r is IDateRangeFieldValidationRule =>
							Boolean(r) &&
							typeof r === "object" &&
							("minDate" in r ||
								"maxDate" in r ||
								"future" in r ||
								"past" in r ||
								"notFuture" in r ||
								"notPast" in r ||
								"excludedDates" in r ||
								"numberOfDays" in r)
					)
				)
		);
		if (!whenRulesForDerivedProps.length || !formValidationConfig) return;

		// Attach the sibling field's yupSchema to each when condition so YupHelper.mapRules can
		// build a proper conditional schema and resolve it against the current form values.
		const processedWhenRules = whenRulesForDerivedProps.map((rule) => ({
			...rule,
			when: Object.fromEntries(
				Object.entries(rule.when).map(([whenFieldId, whenCond]) => [
					whenFieldId,
					{ ...whenCond, yupSchema: formValidationConfig[whenFieldId]?.schema?.clone() },
				])
			),
		}));

		// Build a minimal schema containing only the when conditions (Yup.mixed() keeps meta.rules
		// clean so the resolved schema's meta only contains rules from the active branch).
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fieldSchema = YupHelper.mapRules(Yup.mixed(), processedWhenRules as any);
		// resolve() evaluates the when conditions against parent form values and returns the active branch schema
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const resolvedSchema = (fieldSchema as any).resolve({ parent: currentValues });
		const metaRules = (resolvedSchema.describe().meta?.rules ?? []) as Array<Record<string, unknown>>;
		const getActiveRule = (key: string): unknown => metaRules.find((r) => key in r)?.[key];

		const whenMinDateStr = getActiveRule("minDate") as string | undefined;
		const whenMaxDateStr = getActiveRule("maxDate") as string | undefined;
		const whenFuture = getActiveRule("future") as boolean | undefined;
		const whenPast = getActiveRule("past") as boolean | undefined;
		const whenNotFuture = getActiveRule("notFuture") as boolean | undefined;
		const whenNotPast = getActiveRule("notPast") as boolean | undefined;
		const whenExcludedDates = getActiveRule("excludedDates") as string[] | undefined;
		const whenNoOfDays = getActiveRule("numberOfDays") as number | undefined;

		const effectiveMinDate = whenMinDateStr
			? DateTimeHelper.toLocalDateOrTime(whenMinDateStr, dateFormat, "date")
			: undefined;
		const effectiveMaxDate = whenMaxDateStr
			? DateTimeHelper.toLocalDateOrTime(whenMaxDateStr, dateFormat, "date")
			: undefined;

		const minDateProp = getLatestDate([
			effectiveMinDate,
			whenFuture && LocalDate.now().plusDays(1),
			whenNotPast && LocalDate.now(),
		]);
		const maxDateProp = getEarliestDate([
			effectiveMaxDate,
			whenPast && LocalDate.now().minusDays(1),
			whenNotFuture && LocalDate.now(),
		]);

		const resolvedMinDate = minDateProp
			? minDateProp.format(DEFAULT_DATE_FORMATTER)
			: staticDerivedPropsRef.current.minDate;
		const resolvedMaxDate = maxDateProp
			? maxDateProp.format(DEFAULT_DATE_FORMATTER)
			: staticDerivedPropsRef.current.maxDate;
		const resolvedDisabledDates = whenExcludedDates ?? staticDerivedPropsRef.current.disabledDates;
		const resolvedNumberOfDays = whenNoOfDays ?? staticDerivedPropsRef.current.numberOfDays;

		setDerivedProps((prev) => {
			const next = { ...prev };
			resolvedMinDate !== undefined ? (next.minDate = resolvedMinDate) : delete next.minDate;
			resolvedMaxDate !== undefined ? (next.maxDate = resolvedMaxDate) : delete next.maxDate;
			resolvedDisabledDates !== undefined
				? (next.disabledDates = resolvedDisabledDates)
				: delete next.disabledDates;
			resolvedNumberOfDays !== undefined ? (next.numberOfDays = resolvedNumberOfDays) : delete next.numberOfDays;
			return next;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formValues, formValidationConfig]);

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
