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

	it("should be able to support datetime formats", () => {
		const date = "2020-01-25T12:34";
		const expected = "25 January 2020 12:34";

		const result = DateTimeHelper.formatDateTime(date, "d MMMM uuuu HH:mm", "datetime");

		expect(result).toBe(expected);
	});

	it.each`
		scenario                   | type
		${"wrong date pattern"}    | ${"pattern"}
		${"unsupported date type"} | ${"type"}
	`("should return an error message if $scenario", ({ type }) => {
		const date = "2020-01-25";
		const expected = ERROR_MESSAGES.GENERIC.INVALID;
		let result: string;

		switch (type) {
			case "pattern": {
				result = DateTimeHelper.formatDateTime(date, "unknown", "date");
				break;
			}
			case "type": {
				result = DateTimeHelper.formatDateTime(date, "d MMMM uuuu", "unknown" as any);
				break;
			}
		}

		expect(result).toBe(expected);
	});
});
