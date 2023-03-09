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

	describe("getNestedData", () => {
		it("should be able to get data if key exists", () => {
			const expected = { a: 1 };
			const data = { a: 1, b: 2 };

			const result = ObjectHelper.getNestedValueByKey(data, "a");

			expect(result).toEqual(expected);
		});

		it("should be able to get nested data if key exists", () => {
			const expected = { c: 3 };
			const data = { a: { b: { c: 3 } } };

			const result = ObjectHelper.getNestedValueByKey(data, "c");

			expect(result).toEqual(expected);
		});

		it("should return empty object if key does not exist", () => {
			const expected = {};
			const data = { a: { b: { c: 3 } } };

			const result = ObjectHelper.getNestedValueByKey(data, "d");

			expect(result).toEqual(expected);
		});
	});
});
