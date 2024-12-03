import { DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { ERROR_MESSAGES } from "../components/shared/error-messages"; // import directly to avoid circular dependency
import { IDaysRangeRule } from "../context-providers";

export namespace DateTimeHelper {
	// TODO: split into individual functions by type when parsing/formatting gets more complicated
	export const formatDateTime = (
		value: string,
		format: string,
		type: "date" | "time" | "datetime",
		errorMessage?: string
	): string | undefined => {
		if (!value) return undefined;

		try {
			const timeFormatter = DateTimeFormatter.ofPattern(format)
				.withResolverStyle(ResolverStyle.STRICT)
				.withLocale(Locale.ENGLISH);

			switch (type) {
				case "date":
					return LocalDate.parse(value).format(timeFormatter);
				case "time":
					return LocalTime.parse(value).format(timeFormatter);
				case "datetime":
					return LocalDateTime.parse(value).format(timeFormatter);
				default:
					return errorMessage || ERROR_MESSAGES.GENERIC.INVALID;
			}
		} catch (error) {
			return errorMessage || ERROR_MESSAGES.GENERIC.INVALID;
		}
	};

	export function toLocalDateOrTime(value: string, format: string, type: "date"): LocalDate | undefined;
	export function toLocalDateOrTime(value: string, format: string, type: "time"): LocalTime | undefined;
	export function toLocalDateOrTime(value: string, format: string, type: "datetime"): LocalDateTime | undefined;
	export function toLocalDateOrTime(value: string, format: string, type: "date" | "time" | "datetime") {
		if (!value) return undefined;

		try {
			const timeFormatter = DateTimeFormatter.ofPattern(format)
				.withResolverStyle(ResolverStyle.STRICT)
				.withLocale(Locale.ENGLISH);

			switch (type) {
				case "date":
					return LocalDate.parse(value, timeFormatter);
				case "time":
					return LocalTime.parse(value, timeFormatter);
				case "datetime":
					return LocalDateTime.parse(value, timeFormatter);
				default:
					return undefined;
			}
		} catch (error) {
			return undefined;
		}
	}

	export function calculateWithinDaysRange(withinDays: IDaysRangeRule): {
		startDate: LocalDate;
		endDate: LocalDate;
	} {
		const { numberOfDays, fromDate, dateFormat = "uuuu-MM-dd" } = withinDays;
		const baseDate = fromDate
			? toLocalDateOrTime(fromDate, dateFormat, "date") || LocalDate.now()
			: LocalDate.now();
		if (numberOfDays >= 0) {
			return {
				startDate: baseDate,
				endDate: baseDate.plusDays(numberOfDays),
			};
		} else {
			return {
				startDate: baseDate.plusDays(numberOfDays),
				endDate: baseDate,
			};
		}
	}

	export function calculateDisabledBeyondDaysDates(beyondDays: IDaysRangeRule): string[] {
		const { numberOfDays, fromDate, dateFormat = "uuuu-MM-dd" } = beyondDays;
		const baseDate = fromDate
			? toLocalDateOrTime(fromDate, dateFormat, "date") || LocalDate.now()
			: LocalDate.now();
		const dateFormatter = DateTimeFormatter.ofPattern(dateFormat)
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);
		if (numberOfDays >= 0) {
			return Array((numberOfDays || 0) + 1)
				.fill("")
				.map((_, i) => {
					return baseDate.plusDays(i).format(dateFormatter);
				});
		} else {
			return Array((Math.abs(numberOfDays) || 0) + 1)
				.fill("")
				.map((_, i) => {
					return baseDate.minusDays(i).format(dateFormatter);
				});
		}
	}

	export function checkWithinDays(value: string, withinDays: IDaysRangeRule) {
		if (!value) return true;
		const { dateFormat = "uuuu-MM-dd" } = withinDays;
		const localDate = toLocalDateOrTime(value, dateFormat, "date");
		if (!localDate) return false;
		const { startDate, endDate } = calculateWithinDaysRange(withinDays);
		return localDate.isAfter(startDate) && localDate.isBefore(endDate);
	}

	export function checkBeyondDays(value: string, beyondDays: IDaysRangeRule) {
		if (!value) return true;
		const { dateFormat = "uuuu-MM-dd" } = beyondDays;
		const localDate = toLocalDateOrTime(value, dateFormat, "date");
		if (!localDate) return false;
		const { startDate, endDate } = calculateWithinDaysRange(beyondDays);
		return localDate.isBefore(startDate) || localDate.isAfter(endDate);
	}
}
