import { getSourceFieldsForDependent } from "../../../utils/hooks/use-when-revalidation";

describe("getSourceFieldsForDependent", () => {
	it("should return empty array when dependency map is undefined", () => {
		expect(getSourceFieldsForDependent("fieldA", undefined)).toEqual([]);
	});

	it("should return empty array when dependency map is empty", () => {
		expect(getSourceFieldsForDependent("fieldA", {})).toEqual([]);
	});

	it("should return empty array when field has no source dependencies", () => {
		const whenDependencyMap = {
			fieldB: ["fieldC"],
		};

		expect(getSourceFieldsForDependent("fieldA", whenDependencyMap)).toEqual([]);
	});

	it("should return single source field for a dependent field", () => {
		const whenDependencyMap = {
			fieldB: ["fieldA"],
		};

		expect(getSourceFieldsForDependent("fieldA", whenDependencyMap)).toEqual(["fieldB"]);
	});

	it("should return multiple source fields for a dependent field", () => {
		const whenDependencyMap = {
			fieldA: ["fieldB"],
			fieldC: ["fieldB"],
		};

		expect(getSourceFieldsForDependent("fieldB", whenDependencyMap)).toEqual(["fieldA", "fieldC"]);
	});

	it("should ignore unrelated dependent fields", () => {
		const whenDependencyMap = {
			fieldA: ["fieldB", "fieldC"],
			fieldD: ["fieldE"],
		};

		expect(getSourceFieldsForDependent("fieldC", whenDependencyMap)).toEqual(["fieldA"]);
	});
});
