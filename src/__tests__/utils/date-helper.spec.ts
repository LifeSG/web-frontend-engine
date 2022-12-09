import { DateTimeFormatter, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { ERROR_MESSAGES } from "../../components/shared";
import { DateHelper } from "../../utils";

describe("date-helper", () => {
	it("should be return undefined if no input is provided", () => {
		const timeFormat = DateTimeFormatter.ofPattern("H:mm")
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);
		const expected = undefined;

		const result = DateHelper.formatDateTime(undefined, timeFormat, false);

		expect(result).toBe(expected);
	});

	it("should be able to support time formats", () => {
		const timeFormat = DateTimeFormatter.ofPattern("H:mm")
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);
		const time = "09:42:42.123456789";
		const expected = "9:42";

		const result = DateHelper.formatDateTime(time, timeFormat);

		expect(result).toBe(expected);
	});

	it("should be able to support date formats", () => {
		const dateFormat = DateTimeFormatter.ofPattern("d MMMM uuuu")
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);
		const date = "2020-01-25";
		const expected = "25 January 2020";

		const result = DateHelper.formatDateTime(date, dateFormat, true);

		expect(result).toBe(expected);
	});

	it("should be return error message for invalid inputs", () => {
		const dateFormat = DateTimeFormatter.ofPattern("d MMMM uuuu")
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);
		const date = "abc";
		const expected = ERROR_MESSAGES.DATE.INVALID;

		const result = DateHelper.formatDateTime(date, dateFormat, true);

		expect(result).toBe(expected);
	});
});
