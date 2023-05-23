import * as Yup from "yup";

import { YupHelper } from "../../../../components/frontend-engine/yup";
import { TestHelper } from "../../../../utils";

describe("custom conditions", () => {
	describe("uinfin", () => {
		it("should pass when given a valid uinfin", async () => {
			const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [{ uinfin: true }]);
			["S1111111D", "T8017681Z", "F4769209K", "G5825195Q", "M1234567K"].forEach((uinfin) =>
				expect(() => schema.validateSync(uinfin)).not.toThrowError()
			);
		});

		it("should fail when given an invalid uinfin", () => {
			const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [
				{ uinfin: true, errorMessage: "error" },
			]);
			expect(TestHelper.getError(() => schema.validateSync("S1234567A")).message).toBe("error");
		});
	});

	describe("equalsField", () => {
		it.each`
			type        | field1    | field2
			${"string"} | ${"text"} | ${"text"}
			${"number"} | ${10}     | ${10}
		`("should not throw error if both inputs are same $type", ({ field1, field2 }) => {
			const schema = YupHelper.buildSchema({
				field1: {
					schema: Yup.string(),
					validationRules: [{ required: true }],
				},
				field2: { schema: Yup.string(), validationRules: [{ equalsField: "field1" }] },
			});
			expect(() => schema.validateSync({ field1, field2 })).not.toThrowError();
		});

		it.each`
			type        | field1    | field2
			${"string"} | ${"text"} | ${"test"}
			${"number"} | ${10}     | ${11}
		`("should throw error if both inputs are not same $type", ({ field1, field2 }) => {
			const ERROR_MESSAGE = "test error message";
			const schema = YupHelper.buildSchema({
				field1: {
					schema: Yup.string(),
					validationRules: [{ required: true }],
				},
				field2: {
					schema: Yup.string(),
					validationRules: [{ equalsField: "field1", errorMessage: ERROR_MESSAGE }],
				},
			});
			expect(TestHelper.getError(() => schema.validateSync({ field1, field2 })).message).toBe(ERROR_MESSAGE);
		});
	});
});
