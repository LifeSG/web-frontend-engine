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

	describe("calculateDisabledWithinDaysRange", () => {
		it("should calculate correct range for positive numberOfDays", () => {
			const today = LocalDate.now();
			const result = DateTimeHelper.calculateDisabledWithinDaysRange({
				numberOfDays: 5,
			});

			expect(result.startDate).toEqual(today.plusDays(1));
			expect(result.endDate).toEqual(today.plusDays(5));
		});

		it("should calculate correct range for positive numberOfDays (inclusive)", () => {
			const today = LocalDate.now();
			const result = DateTimeHelper.calculateDisabledWithinDaysRange({
				numberOfDays: 5,
				inclusive: true,
			});

			expect(result.startDate).toEqual(today);
			expect(result.endDate).toEqual(today.plusDays(5));
		});

		it("should calculate correct range for negative numberOfDays", () => {
			const today = LocalDate.now();
			const result = DateTimeHelper.calculateDisabledWithinDaysRange({
				numberOfDays: -5,
			});

			expect(result.startDate).toEqual(today.minusDays(5));
			expect(result.endDate).toEqual(today.minusDays(1));
		});

		it("should calculate correct range for negative numberOfDays (inclusive)", () => {
			const today = LocalDate.now();
			const result = DateTimeHelper.calculateDisabledWithinDaysRange({
				numberOfDays: -5,
				inclusive: true,
			});

			expect(result.startDate).toEqual(today.minusDays(5));
			expect(result.endDate).toEqual(today);
		});
	});

	describe("calculateDisabledBeyondDaysDates", () => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockImplementation(() => LocalDate.parse("2023-06-15"));
		});

		it.each`
			scenario                       | numberOfDays | expectedResults                                                     | fromDate
			${"beyond today"}              | ${3}         | ${{ startDate: LocalDate.parse("2023-06-19"), endDate: undefined }} | ${undefined}
			${"before today"}              | ${-3}        | ${{ startDate: undefined, endDate: LocalDate.parse("2023-06-11") }} | ${undefined}
			${"beyond the reference date"} | ${3}         | ${{ startDate: LocalDate.parse("2023-05-19"), endDate: undefined }} | ${"2023-05-15"}
			${"before the reference date"} | ${-3}        | ${{ startDate: undefined, endDate: LocalDate.parse("2023-05-11") }} | ${"2023-05-15"}
		`(
			"should return dates $scenario based of the number of days specified",
			({ numberOfDays, fromDate, expectedResults }) => {
				const beyondDays: IDaysRangeRule = {
					numberOfDays,
					fromDate,
					dateFormat: "uuuu-MM-dd",
				};

				const result = DateTimeHelper.calculateDisabledBeyondDaysRange(beyondDays);

				expect(result).toEqual(expectedResults);
			}
		);

		it("should handle custom date formats", () => {
			const beyondDays: IDaysRangeRule = {
				numberOfDays: 2,
				fromDate: "01/10/2023",
				dateFormat: "dd/MM/uuuu",
			};

			const result = DateTimeHelper.calculateDisabledBeyondDaysRange(beyondDays);
			expect(result).toEqual({ startDate: LocalDate.parse("2023-10-04"), endDate: undefined });
		});

		it("should return next day if numberOfDays is 0", () => {
			const beyondDays: IDaysRangeRule = {
				numberOfDays: 0,
				fromDate: "2023-10-01",
				dateFormat: "uuuu-MM-dd",
			};
			const result = DateTimeHelper.calculateDisabledBeyondDaysRange(beyondDays);
			expect(result).toEqual({ startDate: LocalDate.parse("2023-10-02"), endDate: undefined });
		});
	});

	describe("checkWithinDays", () => {
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
			${"date is before date range"} | ${"2023-06-14"}   | ${false}
			${"date is after date range"}  | ${"2023-06-21"}   | ${false}
			${"date is current day"}       | ${"2023-06-15"}   | ${false}
			${"date is within date range"} | ${"2023-06-20"}   | ${true}
		`("should return $expected if $scenario for positive days", ({ value, expected }) => {
			const result = DateTimeHelper.checkWithinDays(value, {
				numberOfDays: 5,
			});
			expect(result).toBe(expected);
		});

		it("should return true for current day if inclusive for positive days", () => {
			const result = DateTimeHelper.checkWithinDays("2023-06-15", {
				numberOfDays: 5,
				inclusive: true,
			});
			expect(result).toBe(true);
		});

		it.each`
			scenario                       | value             | expected
			${"no date is specified"}      | ${""}             | ${true}
			${"invalid date is specified"} | ${"invalid-date"} | ${false}
			${"date is before date range"} | ${"2023-06-09"}   | ${false}
			${"date is after date range"}  | ${"2023-06-16"}   | ${false}
			${"date is current day"}       | ${"2023-06-15"}   | ${false}
			${"date is within date range"} | ${"2023-06-10"}   | ${true}
		`("should return $expected if $scenario for negative days", ({ value, expected }) => {
			const result = DateTimeHelper.checkWithinDays(value, {
				numberOfDays: -5,
			});
			expect(result).toBe(expected);
		});

		it("should return true for current day if inclusive for negative days", () => {
			const result = DateTimeHelper.checkWithinDays("2023-06-15", {
				numberOfDays: -5,
				inclusive: true,
			});
			expect(result).toBe(true);
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
			${"date is before date range"} | ${"2023-09-25"}   | ${false}
			${"date is after date range"}  | ${"2023-10-07"}   | ${true}
			${"date is within date range"} | ${"2023-10-06"}   | ${false}
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
