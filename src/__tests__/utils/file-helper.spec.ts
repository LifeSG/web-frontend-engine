import { FileHelper } from "../../utils";

describe("FileHelper", () => {
	describe("sanitizeFileName", () => {
		it.each`
			scenario                                   | input                         | expected
			${"keep allowed characters"}               | ${"this is OK_-123.png"}      | ${"this is OK_-123.png"}
			${"strip leading and trailing spaces"}     | ${"\t\n  test \t\n.png"}      | ${"test.png"}
			${"strip special characters"}              | ${"`~!@#$%^&*()=+test✨.png"} | ${"test.png"}
			${"remove periods"}                        | ${"test.test.png"}            | ${"testtest.png"}
			${"fallback to default with extension"}    | ${"   .txt"}                  | ${"file.txt"}
			${"fallback to default without extension"} | ${"   "}                      | ${"file"}
			${"handle file without extension"}         | ${".!env"}                    | ${"env"}
		`("should $scenario", ({ input, expected }) => {
			expect(FileHelper.sanitizeFileName(input)).toEqual(expected);
		});
	});
});
