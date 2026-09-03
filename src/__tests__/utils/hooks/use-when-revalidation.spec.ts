import { getWhenDependencies } from "../../../utils/hooks/use-when-revalidation";
import { IYupValidationRule } from "../../../context-providers";

describe("getWhenDependencies", () => {
	it("should return empty array when validation rules are undefined", () => {
		expect(getWhenDependencies(undefined)).toEqual([]);
	});

	it("should return empty array when validation rules are empty", () => {
		expect(getWhenDependencies([])).toEqual([]);
	});

	it("should return empty array when no when rules exist", () => {
		expect(getWhenDependencies([{ required: true }])).toEqual([]);
	});

	it("should return single dependency from a when rule", () => {
		const rules: IYupValidationRule[] = [
			{
				when: {
					fieldA: { is: "yes", then: [{ required: true }] },
				},
			},
		];
		expect(getWhenDependencies(rules)).toEqual(["fieldA"]);
	});

	it("should return multiple dependencies from a single when rule", () => {
		const rules: IYupValidationRule[] = [
			{
				when: {
					fieldA: { is: "yes", then: [{ required: true }] },
					fieldC: { is: "active", then: [{ required: true }] },
				},
			},
		];
		expect(getWhenDependencies(rules)).toEqual(["fieldA", "fieldC"]);
	});

	it("should not duplicate dependencies across multiple when rules", () => {
		const rules: IYupValidationRule[] = [
			{ when: { fieldA: { is: "yes", then: [{ required: true }] } } },
			{ when: { fieldA: { is: "no", then: [{ required: false }] } } },
			{ when: { fieldC: { is: "active", then: [{ required: true }] } } },
		];
		expect(getWhenDependencies(rules)).toEqual(["fieldA", "fieldC"]);
	});
});
