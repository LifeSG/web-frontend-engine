import { LocalDate } from "@js-joda/core";
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

	it("should calculate correct range for positive numberOfDays", () => {
		const today = LocalDate.now();
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: 5,
		});

		expect(result.startDate).toEqual(today);
		expect(result.endDate).toEqual(today.plusDays(5));
	});

	it("should calculate correct range for negative numberOfDays", () => {
		const today = LocalDate.now();
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: -5,
		});

		expect(result.startDate).toEqual(today.minusDays(5));
		expect(result.endDate).toEqual(today);
	});

	it("should use provided fromDate when specified", () => {
		const fromDate = "2023-06-01";
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: 3,
			fromDate,
		});

		expect(result.startDate).toEqual(LocalDate.parse(fromDate));
		expect(result.endDate).toEqual(LocalDate.parse(fromDate).plusDays(3));
	});

	it("should handle custom date format", () => {
		const fromDate = "01/06/2023";
		const customDateFormat = "dd/MM/uuuu";
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: 3,
			fromDate,
			dateFormat: customDateFormat,
		});

		expect(result.startDate).toEqual(LocalDate.parse("2023-06-01"));
		expect(result.endDate).toEqual(LocalDate.parse("2023-06-04"));
	});

	it("should use current date if fromDate is invalid", () => {
		const today = LocalDate.now();
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: 3,
			fromDate: "invalid-date",
		});

		expect(result.startDate).toEqual(today);
		expect(result.endDate).toEqual(today.plusDays(3));
	});

	it("should handle zero numberOfDays", () => {
		const today = LocalDate.now();
		const result = DateTimeHelper.calculateWithinDaysRange({
			numberOfDays: 0,
		});

		expect(result.startDate).toEqual(today);
		expect(result.endDate).toEqual(today);
	});

	describe("DateTimeHelper.checkWithinDays", () => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockImplementation(() => LocalDate.parse("2023-06-15"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it("should return true for a date within the specified positive range", () => {
			const result = DateTimeHelper.checkWithinDays("2023-06-17", {
				numberOfDays: 5,
			});
			expect(result).toBe(true);
		});

		it("should return false for a date outside the specified positive range", () => {
			const result = DateTimeHelper.checkWithinDays("2023-06-21", {
				numberOfDays: 5,
			});
			expect(result).toBe(false);
		});
	});
});
