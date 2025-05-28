import { YupHelper } from "../../../../context-providers";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE } from "../../../common";

it.each`
	type        | config              | valid                                                                               | invalid
	${"uinfin"} | ${{ uinfin: true }} | ${["S1111111D", "T8017681Z", "F4769209K", "G5825195Q", "M1234567K", "", undefined]} | ${["S1234567A"]}
	${"uen"}    | ${{ uen: true }}    | ${["200012345A", "12345678A", "T09LL0001B", undefined]}                             | ${["1234A567A", "T09L10001B"]}
`("should support $type validation", ({ config, valid, invalid }) => {
	const schema = YupHelper.buildFieldSchema(YupHelper.mapSchemaType("string"), [
		{ ...config, errorMessage: ERROR_MESSAGE },
	]);

	valid.forEach((validValue: string | undefined) => expect(() => schema.validateSync(validValue)).not.toThrow());
	invalid.forEach((invalidValue: string | undefined) =>
		expect(TestHelper.getError(() => schema.validateSync(invalidValue)).message).toBe(ERROR_MESSAGE)
	);
});
