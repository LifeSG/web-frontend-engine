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

	describe("isFetchableFileUrl", () => {
		it.each`
			scenario                    | url
			${"https"}                  | ${"https://example.com/files/1"}
			${"http"}                   | ${"http://example.com/files/1"}
			${"relative path"}          | ${"/api/files/1"}
			${"relative without slash"} | ${"dummy url"}
			${"protocol-relative"}      | ${"//example.com/files/1"}
			${"uppercase scheme"}       | ${"HTTPS://example.com/files/1"}
		`("should allow $scenario", ({ url }) => {
			expect(FileHelper.isFetchableFileUrl(url)).toBe(true);
		});

		it.each`
			scenario                | url
			${"javascript:"}        | ${"javascript:alert(1)"}
			${"data:"}              | ${"data:image/png;base64,iVBORw0KGgo="}
			${"file:"}              | ${"file:///etc/passwd"}
			${"blob:"}              | ${"blob:https://example.com/uuid"}
			${"ftp:"}               | ${"ftp://example.com/file"}
			${"padded javascript:"} | ${"  javascript:alert(1)"}
			${"empty"}              | ${""}
			${"whitespace"}         | ${"   "}
			${"undefined"}          | ${undefined}
			${"number"}             | ${123}
		`("should reject $scenario", ({ url }) => {
			expect(FileHelper.isFetchableFileUrl(url)).toBe(false);
		});
	});

	describe("sanitizeFileName", () => {
		it.each`
			scenario                                   | input                                        | expected
			${"keep allowed characters"}               | ${"Ok123_- (1).png"}                         | ${"Ok123_- (1).png"}
			${"strip other ascii characters"}          | ${"Ok123_- !@#$%^&*~..png"}                  | ${"Ok123_-.png"}
			${"strip special characters"}              | ${"test ✨可.png"}                           | ${"test.png"}
			${"fallback to default with extension"}    | ${"✨.txt"}                                  | ${"file.txt"}
			${"fallback to default without extension"} | ${"✨"}                                      | ${"file"}
			${"handle file without extension"}         | ${".env"}                                    | ${".env"}
			${"keep dotfile"}                          | ${".htaccess"}                               | ${".htaccess"}
			${"keep inner dots"}                       | ${"report.v2.final.pdf"}                     | ${"report.v2.final.pdf"}
			${"collapse repeated dots"}                | ${"report..pdf"}                             | ${"report.pdf"}
			${"strip unix path traversal"}             | ${"../../../etc/passwd"}                     | ${"file.etcpasswd"}
			${"strip windows path traversal"}          | ${"..\\..\\win.ini"}                         | ${"win.ini"}
			${"strip path separators"}                 | ${"a/b.png"}                                 | ${"ab.png"}
			${"strip leading dots before a name"}      | ${"..secret"}                                | ${"file.secret"}
			${"strip markup characters"}               | ${"<img src=x onerror=alert(1)>.png"}        | ${"img srcx onerroralert(1).png"}
			${"strip reserved characters"}             | ${'a:b*c?"d|e.txt'}                          | ${"abcde.txt"}
			${"keep macOS screenshot name"}            | ${"Screenshot 2025-06-06 at 4.08.20 PM.png"} | ${"Screenshot 2025-06-06 at 4.08.20PM.png"}
		`("should $scenario", ({ input, expected }) => {
			expect(FileHelper.sanitizeFileName(input)).toEqual(expected);
		});
	});

	describe("extensionsToSentence", () => {
		describe("setBothJpegAndJpgIfEitherExists", () => {
			it.each`
				extensions                | expected
				${["jpg"]}                | ${".JPG or .JPEG"}
				${["jpeg"]}               | ${".JPEG or .JPG"}
				${["jpg", "jpeg"]}        | ${".JPG or .JPEG"}
				${["jpg", "png"]}         | ${".JPG, .JPEG or .PNG"}
				${["jpeg", "png"]}        | ${".JPEG, .JPG or .PNG"}
				${["png", "jpg"]}         | ${".PNG, .JPG or .JPEG"}
				${["png", "jpeg"]}        | ${".PNG, .JPEG or .JPG"}
				${["png"]}                | ${".PNG"}
				${["pdf", "png"]}         | ${".PDF or .PNG"}
				${["jpg", "jpeg", "png"]} | ${".JPG, .JPEG or .PNG"}
			`("should format $extensions as '$expected'", ({ extensions, expected }) => {
				const result = FileHelper.extensionsToSentence(extensions, { setBothJpegAndJpgIfEitherExists: true });
				expect(result).toBe(expected);
			});

			it("should not duplicate extensions if both jpg and jpeg are already present", () => {
				const result = FileHelper.extensionsToSentence(["jpg", "jpeg"], {
					setBothJpegAndJpgIfEitherExists: true,
				});
				expect(result).toBe(".JPG or .JPEG");
			});

			it("should add jpeg after jpg when only jpg is present", () => {
				const result = FileHelper.extensionsToSentence(["jpg"], { setBothJpegAndJpgIfEitherExists: true });
				expect(result).toBe(".JPG or .JPEG");
			});

			it("should add jpg after jpeg when only jpeg is present", () => {
				const result = FileHelper.extensionsToSentence(["jpeg"], { setBothJpegAndJpgIfEitherExists: true });
				expect(result).toBe(".JPEG or .JPG");
			});

			it("should preserve order and add jpeg after jpg in a list", () => {
				const result = FileHelper.extensionsToSentence(["png", "jpg", "pdf"], {
					setBothJpegAndJpgIfEitherExists: true,
				});
				expect(result).toBe(".PNG, .JPG, .JPEG or .PDF");
			});

			it("should preserve order and add jpg after jpeg in a list", () => {
				const result = FileHelper.extensionsToSentence(["png", "jpeg", "pdf"], {
					setBothJpegAndJpgIfEitherExists: true,
				});
				expect(result).toBe(".PNG, .JPEG, .JPG or .PDF");
			});

			it("should not modify list when neither jpg nor jpeg is present", () => {
				const result = FileHelper.extensionsToSentence(["png", "pdf"], {
					setBothJpegAndJpgIfEitherExists: true,
				});
				expect(result).toBe(".PNG or .PDF");
			});
		});

		describe("without setBothJpegAndJpgIfEitherExists option", () => {
			it.each`
				extensions         | expected
				${["jpg"]}         | ${".JPG"}
				${["jpeg"]}        | ${".JPEG"}
				${["jpg", "jpeg"]} | ${".JPG or .JPEG"}
				${["jpg", "png"]}  | ${".JPG or .PNG"}
				${["png", "pdf"]}  | ${".PNG or .PDF"}
			`("should format $extensions as '$expected'", ({ extensions, expected }) => {
				const result = FileHelper.extensionsToSentence(extensions);
				expect(result).toBe(expected);
			});
		});
	});
});
