import { boldResultsWithQuery } from "../../../../components/fields/location-field/location-modal/location-search/helper";
import { IResultListItem } from "../../../../components/fields/location-field/types";

const buildResult = (address: string): IResultListItem => ({
	address,
	displayAddressText: undefined,
});

describe("boldResultsWithQuery", () => {
	it("should bold the matching portion of the address", () => {
		const [result] = boldResultsWithQuery([buildResult("123 Example Street")], "Example");

		expect(result.displayAddressText).toBe('123 <span class="keyword">Example</span> Street');
	});

	it("should treat regex metacharacters in the query as literal characters", () => {
		const [result] = boldResultsWithQuery([buildResult("Blk 5 (Example)")], "(Example)");

		expect(result.displayAddressText).toBe('Blk 5 <span class="keyword">(Example)</span>');
	});

	it("should not hang or throw on a pathological regex-injection query", () => {
		const maliciousQuery = "(a+)+$";

		const start = Date.now();
		expect(() =>
			boldResultsWithQuery([buildResult("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!")], maliciousQuery)
		).not.toThrow();
		expect(Date.now() - start).toBeLessThan(1000);
	});
});
