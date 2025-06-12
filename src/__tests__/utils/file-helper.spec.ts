import { FileHelper } from "../../utils";

describe("FileHelper", () => {
	describe("deduplicateFileName", () => {
		it("should return original file name if it is unique", () => {
			const fileName = "two.png";
			const fileNameList = ["one.png", "two.png"];
			const index = 1;
			expect(FileHelper.deduplicateFileName(fileNameList, index, fileName)).toEqual("two.png");
		});

		it("should return deduplicated file name if it is not unique", () => {
			const fileName = "one.png";
			const fileNameList = ["one.png", "one.png"];
			const index = 1;
			expect(FileHelper.deduplicateFileName(fileNameList, index, fileName)).toEqual("one (1).png");
		});

		it("should return deduplicated file name if multiple files are not unique", () => {
			const fileName = "one.png";
			const fileNameList = ["one.png", "one (1).png", "one.png"];
			const index = 2;
			expect(FileHelper.deduplicateFileName(fileNameList, index, fileName)).toEqual("one (2).png");
		});

		it("should append correctly to file name containing special characters", () => {
			const fileName = "test.test .png";
			const fileNameList = [fileName, fileName];
			const index = 1;
			expect(FileHelper.deduplicateFileName(fileNameList, index, fileName)).toEqual("test.test  (1).png");
		});
	});

	describe("sanitizeFileName", () => {
		it.each`
			scenario                                   | input                         | expected
			${"keep allowed characters"}               | ${"Ok123_- !@#$%^&*()~..png"} | ${"Ok123_- !@#$%^&*()~..png"}
			${"strip special characters"}              | ${"test\u00A0✨可.png"}       | ${"test.png"}
			${"fallback to default with extension"}    | ${"✨.txt"}                   | ${"file.txt"}
			${"fallback to default without extension"} | ${"✨"}                       | ${"file"}
			${"handle file without extension"}         | ${".env"}                     | ${".env"}
		`("should $scenario", ({ input, expected }) => {
			expect(FileHelper.sanitizeFileName(input)).toEqual(expected);
		});
	});
});
