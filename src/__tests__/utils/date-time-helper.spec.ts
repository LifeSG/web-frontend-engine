import { ERROR_MESSAGES } from "../../components/shared";
import { DateTimeHelper } from "../../utils";

describe("date-time-helper", () => {
	it("should be return undefined if no input is provided", () => {
		const expected = undefined;

		const result = DateTimeHelper.formatDateTime(undefined, "H:mm", "time");

		expect(result).toBe(expected);
	});

	it("should be able to support time formats", () => {
		const time = "09:42:42.123456789";
		const expected = "9:42";

		const result = DateTimeHelper.formatDateTime(time, "H:mm", "time");

		expect(result).toBe(expected);
	});

	it("should be able to support date formats", () => {
		const date = "2020-01-25";
		const expected = "25 January 2020";

		const result = DateTimeHelper.formatDateTime(date, "d MMMM uuuu", "date");

		expect(result).toBe(expected);
	});
});
