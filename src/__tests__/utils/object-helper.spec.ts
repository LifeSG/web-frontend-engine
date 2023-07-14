import { ObjectHelper } from "../../utils";

describe("object-helper", () => {
	describe("upsert", () => {
		it("should be able to insert new key value pair into object", () => {
			const expected = { a: { b: 1 } };
			const data = {};

			const result = ObjectHelper.upsert(data, "a", { b: 1 });

			expect(result).toEqual(expected);
		});

		it("should be able to update new key value pair into object", () => {
			const expected = { a: { b: 1, c: 2 } };
			const data = { a: { b: 1, c: 1 } };

			const result = ObjectHelper.upsert(data, "a", { b: 1, c: 2 });

			expect(result).toEqual(expected);
		});
	});

	describe("getNestedValueByKey", () => {
		it("should be able to get data if key exists", () => {
			const expected = { a: 1 };
			const data = { a: 1, b: 2 };

			const result = ObjectHelper.getNestedValueByKey(data, "a");

			expect(result).toEqual(expected);
		});

		it("should be able to get nested data if key exists", () => {
			const expected = { c: 2 };
			const data = { a: { b: { e: 1 }, d: { c: 2 } } };

			const result = ObjectHelper.getNestedValueByKey(data, "c");

			expect(result).toEqual(expected);
		});

		it("should return empty object if key does not exist", () => {
			const expected = undefined;
			const data = { a: { b: { c: 3 } } };

			const result = ObjectHelper.getNestedValueByKey(data, "d");

			expect(result).toEqual(expected);
		});

		it("should ignore keys at root level if skipRoot = true", () => {
			const expected = { c: 1 };
			const data = { a: { c: 1 }, c: 2 };
			const result = ObjectHelper.getNestedValueByKey(data, "c", { skipRoot: true });

			expect(result).toEqual(expected);
		});

		it("should get data from keys defined in searchIn only", () => {
			const expected = { c: 2 };
			const data = { a: { c: 1 }, b: { c: 2 } };
			const result = ObjectHelper.getNestedValueByKey(data, "c", { searchIn: ["b"] });

			expect(result).toEqual(expected);
		});

		it("should get data from nested keys defined in searchIn only", () => {
			const expected = { d: 2 };
			const data = { a: { d: 1 }, b: { a: { d: 1 }, c: { d: 2 } } };
			const result = ObjectHelper.getNestedValueByKey(data, "d", { searchIn: ["b", "c"] });

			expect(result).toEqual(expected);
		});
	});

	describe("removeNil", () => {
		describe.each`
			type              | value
			${"undefined"}    | ${undefined}
			${"null"}         | ${null}
			${"empty object"} | ${{}}
			${"empty array"}  | ${[]}
		`("$type", ({ type, value }) => {
			it(`should remove key if it is ${type}`, () => {
				const expected = { a: 1 };
				const data = { a: 1, b: value };
				const result = ObjectHelper.removeNil(data);

				expect(result).toEqual(expected);
			});

			it(`should remove nested key if it is ${type}`, () => {
				const expected = { a: 1, b: { c: 2 } };
				const data = { a: 1, b: { c: 2, d: value, e: { f: value } } };
				const result = ObjectHelper.removeNil(data);

				expect(result).toEqual(expected);
			});

			it(`should remove value in array if it is ${type}`, () => {
				const expected = { a: 1, b: [2] };
				const data = { a: 1, b: [2, value], c: [value] };
				const result = ObjectHelper.removeNil(data);

				expect(result).toEqual(expected);
			});
		});
	});
});
