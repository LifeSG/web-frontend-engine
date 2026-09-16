import { YupHelper } from "../../../../context-providers";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE } from "../../../common";

it.each`
	type          | config                | valid                                                                               | invalid
	${"uinfin"}   | ${{ uinfin: true }}   | ${["S1111111D", "T8017681Z", "F4769209K", "G5825195Q", "M1234567K", "", undefined]} | ${["S1234567A"]}
	${"uen"}      | ${{ uen: true }}      | ${["200012345A", "12345678A", "T09LL0001B", undefined]}                             | ${["1234A567A", "T09L10001B"]}
	${"htmlSafe"} | ${{ htmlSafe: true }} | ${["TAN AH KOW", "O'CONNOR", "A/B TEST", "LEE (ALIAS)", "A.B. @ C", "", undefined]} | ${["<script>", "LEE_123", "TAN&LEE", "张三", "Jane🙂"]}
`("should support $type validation", ({ config, valid, invalid }) => {
	const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [
		{ ...config, errorMessage: ERROR_MESSAGE },
	]);

	valid.forEach((validValue: string | undefined) => expect(() => schema.validateSync(validValue)).not.toThrow());
	invalid.forEach((invalidValue: string | undefined) =>
		expect(TestHelper.getError(() => schema.validateSync(invalidValue)).message).toBe(ERROR_MESSAGE)
	);
});

describe("notMatches", () => {
	const buildSchema = (regex: string) =>
		YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [
			{ notMatches: regex, errorMessage: ERROR_MESSAGE },
		]);

	it("should not throw when the regex string is malformed", () => {
		const schema = buildSchema("not a /pattern/flags string [");

		expect(() => schema.validateSync("hello")).not.toThrow();
	});

	it("should reject an overly long value instead of testing it against the pattern", () => {
		const schema = buildSchema("/^(a+)+$/");
		const maliciousValue = `${"a".repeat(600)}!`;

		const start = Date.now();
		expect(TestHelper.getError(() => schema.validateSync(maliciousValue)).message).toBe(ERROR_MESSAGE);
		expect(Date.now() - start).toBeLessThan(1000);
	});
});
