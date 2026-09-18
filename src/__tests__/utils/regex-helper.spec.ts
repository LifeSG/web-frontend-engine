import { RegexHelper } from "../../utils";

describe("regex-helper", () => {
	describe("parseMatchesPattern", () => {
		it("should parse a /pattern/flags string into a RegExp", () => {
			const regex = RegexHelper.parseMatchesPattern("/^hello/i");

			expect(regex).toBeInstanceOf(RegExp);
			expect(regex.source).toBe("^hello");
			expect(regex.flags).toBe("i");
		});

		it("should fall back to treating the whole string as a pattern when it has no /pattern/flags wrapper", () => {
			const regex = RegexHelper.parseMatchesPattern("hello");

			expect(regex).toBeInstanceOf(RegExp);
			expect(regex.source).toBe("hello");
		});

		it("should return undefined instead of throwing on an invalid pattern", () => {
			expect(RegexHelper.parseMatchesPattern("/[/")).toBeUndefined();
		});
	});

	describe("safeTestRegex", () => {
		it("should return false when regex is undefined", () => {
			expect(RegexHelper.safeTestRegex(undefined, "hello")).toBe(false);
		});

		it("should test the value against the regex when within the safe length bound", () => {
			expect(RegexHelper.safeTestRegex(/^hello/, "hello world")).toBe(true);
			expect(RegexHelper.safeTestRegex(/^hello/, "goodbye world")).toBe(false);
		});

		it("should return false when value exceeds the safe length bound", () => {
			const maliciousValue = `${"a".repeat(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH + 1)}!`;

			const start = Date.now();
			expect(RegexHelper.safeTestRegex(/^(a+)+$/, maliciousValue)).toBe(false);
			expect(Date.now() - start).toBeLessThan(1000);
		});

		it("should return false when a short value does not match the pattern", () => {
			const nearMatch = `${"a".repeat(25)}!`;

			expect(RegexHelper.safeTestRegex(/^(a+)+$/, nearMatch)).toBe(false);
		});
	});
});
