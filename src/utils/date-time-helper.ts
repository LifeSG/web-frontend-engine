import { DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { ERROR_MESSAGES } from "../components/shared/error-messages"; // import directly to avoid circular dependency

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
}
