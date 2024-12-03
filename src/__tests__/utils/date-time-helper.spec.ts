import { LocalDate } from "@js-joda/core";
import { ERROR_MESSAGES } from "../../components/shared";
import { IDaysRangeRule } from "../../context-providers";
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

	describe("calculateWithinDaysRange", () => {
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
	});

	describe("calculateDisabledBeyondDaysDates", () => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockImplementation(() => LocalDate.parse("2023-06-15"));
		});

		it.each`
			scenario                       | numberOfDays | expectedResults                                             | fromDate
			${"beyond today"}              | ${3}         | ${["2023-06-15", "2023-06-16", "2023-06-17", "2023-06-18"]} | ${undefined}
			${"before today"}              | ${-3}        | ${["2023-06-15", "2023-06-14", "2023-06-13", "2023-06-12"]} | ${undefined}
			${"beyond the reference date"} | ${3}         | ${["2023-05-15", "2023-05-16", "2023-05-17", "2023-05-18"]} | ${"2023-05-15"}
			${"before the reference date"} | ${-3}        | ${["2023-05-15", "2023-05-14", "2023-05-13", "2023-05-12"]} | ${"2023-05-15"}
		`(
			"should return dates $scenario based of the number of days specified",
			({ numberOfDays, fromDate, expectedResults }) => {
				const beyondDays: IDaysRangeRule = {
					numberOfDays,
					fromDate,
					dateFormat: "uuuu-MM-dd",
				};

				const result = DateTimeHelper.calculateDisabledBeyondDaysDates(beyondDays);

				expect(result).toEqual(expectedResults);
			}
		);

		it("should handle custom date formats", () => {
			const beyondDays: IDaysRangeRule = {
				numberOfDays: 2,
				fromDate: "01/10/2023",
				dateFormat: "dd/MM/uuuu",
			};

			const result = DateTimeHelper.calculateDisabledBeyondDaysDates(beyondDays);

			// Expected dates with custom date format
			const expectedDates = ["01/10/2023", "02/10/2023", "03/10/2023"];

			expect(result).toEqual(expectedDates);
		});

		it("should return only today's date if numberOfDays is 0", () => {
			const beyondDays: IDaysRangeRule = {
				numberOfDays: 0,
				fromDate: "2023-10-01",
				dateFormat: "uuuu-MM-dd",
			};
			const result = DateTimeHelper.calculateDisabledBeyondDaysDates(beyondDays);

			expect(result).toEqual(["2023-10-01"]);
		});
	});

	describe("checkWithinDays", () => {
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

	describe("checkBeyondDays", () => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockImplementation(() => LocalDate.parse("2023-06-15"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it.each`
			scenario                       | value             | expected
			${"no date is specified"}      | ${""}             | ${true}
			${"invalid date is specified"} | ${"invalid-date"} | ${false}
			${"date is before date range"} | ${"2023-09-25"}   | ${true}
			${"date is after date range"}  | ${"2023-10-10"}   | ${true}
			${"date is within date range"} | ${"2023-10-03"}   | ${false}
		`("should return $expected if $scenario", ({ value, expected }) => {
			const result = DateTimeHelper.checkBeyondDays(value, {
				numberOfDays: 5,
				fromDate: "2023-10-01",
				dateFormat: "uuuu-MM-dd",
			});
			expect(result).toBe(expected);
		});
	});
});
