import * as Yup from "yup";
import { YupHelper } from "../../../../components/frontend-engine/yup";
import { TestHelper } from "../../../../utils";

describe("validateUinfin", () => {
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
});

describe("equals", () => {
	it("should pass if given a valid string", () => {
		const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [{ equals: "valid string" }]);
		expect(() => schema.validateSync("valid string")).not.toThrowError();
	});

	it("should fail if given an invalid string", () => {
		const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [{ equals: "valid string" }]);
		["any other string", ""].forEach((inputString) =>
			expect(TestHelper.getError(() => schema.validateSync(inputString)).message).toBe("this is invalid")
		);
	});

	it("should pass if given a valid boolean", () => {
		const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("boolean"), [{ equals: true }]);
		expect(() => schema.validateSync(true)).not.toThrowError();
	});

	it("should fail if given an invalid boolean", () => {
		const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [{ equals: true }]);
		expect(TestHelper.getError(() => schema.validateSync("valid string")).message).toBe("this is invalid");
	});

	it("should pass if given a valid number", () => {
		const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("number"), [{ equals: 25 }]);
		expect(() => schema.validateSync(25)).not.toThrowError();
	});

	it("should fail if given an invalid number", () => {
		const schema = YupHelper.buildFieldSchema(Yup.mixed(), [{ equals: 25 }]);
		expect(TestHelper.getError(() => schema.validateSync(null)).message).toBe("this is invalid");
	});

	it("should fail if given undefined", () => {
		const schemaOne = YupHelper.buildFieldSchema(Yup.mixed(), [{ equals: 25 }]);
		const schemaTwo = YupHelper.buildFieldSchema(Yup.mixed(), [{ equals: "valid string" }]);
		const schemaThree = YupHelper.buildFieldSchema(Yup.mixed(), [{ equals: "valid string" }]);

		[schemaOne, schemaTwo, schemaThree].forEach((schema) =>
			expect(TestHelper.getError(() => schema.validateSync(undefined)).message).toBe("this is invalid")
		);
	});
});
