import { StyleHelper } from "../../utils";

describe("style-helper", () => {
	describe("sanitizeStyleString", () => {
		it("should strip @import rules", () => {
			const result = StyleHelper.sanitizeStyleString(
				'padding: 1rem; @import url("https://evil.example.com/x.css");'
			);

			expect(result).not.toContain("@import");
			expect(result).toContain("padding: 1rem;");
		});

		it("should strip url() references", () => {
			const result = StyleHelper.sanitizeStyleString('background: url("https://evil.example.com/track.png");');

			expect(result).not.toContain("url(");
		});

		it("should leave a style string with neither construct unchanged", () => {
			const value = "padding: 1rem; margin: 2rem;";

			expect(StyleHelper.sanitizeStyleString(value)).toBe(value);
		});
	});
});
