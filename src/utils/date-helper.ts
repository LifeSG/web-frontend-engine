import { DateTimeFormatter, LocalDate, LocalTime } from "@js-joda/core";
import { ERROR_MESSAGES } from "../components/shared";

export namespace DateHelper {
	export const formatDateTime = (value: string, format: DateTimeFormatter, isDate = false): string | undefined => {
		if (!value) return undefined;

		try {
			if (isDate) {
				return LocalDate.parse(value).format(format);
			}
			return LocalTime.parse(value).format(format);
		} catch (error) {
			return ERROR_MESSAGES.DATE.INVALID;
		}
	};
}
