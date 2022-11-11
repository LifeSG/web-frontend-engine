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
