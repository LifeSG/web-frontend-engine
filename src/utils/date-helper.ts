import { DateTimeFormatter, LocalTime } from "@js-joda/core";
import { ERROR_MESSAGES } from "../components/shared";

export namespace DateHelper {
	export const formatTime = (time: string, format: DateTimeFormatter): string | undefined => {
		if (!time) return undefined;

		try {
			return LocalTime.parse(time).format(format);
		} catch (error) {
			return ERROR_MESSAGES.DATE.INVALID;
		}
	};
}
