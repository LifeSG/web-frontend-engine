import { ObjectHelper } from "../../utils";

describe("object-helper", () => {
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
