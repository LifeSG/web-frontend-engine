import { DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { ERROR_MESSAGES } from "../components/shared";

export namespace DateTimeHelper {
	// TODO: split into individual functions by type when parsing/formatting gets more complicated
	export const formatDateTime = (
		value: string,
		format: string,
		type: "date" | "time" | "datetime"
	): string | undefined => {
		if (!value) return undefined;

		const timeFormatter = DateTimeFormatter.ofPattern(format)
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);

		try {
			if (type === "date") {
				return LocalDate.parse(value).format(timeFormatter);
			} else if (type === "time") {
				return LocalTime.parse(value).format(timeFormatter);
			} else if (type === "datetime") {
				return LocalDateTime.parse(value).format(timeFormatter);
			}
		} catch (error) {
			return ERROR_MESSAGES.DATE.INVALID;
		}
	};
}
