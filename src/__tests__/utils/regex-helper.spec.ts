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

		it("should not hang and should return false when value exceeds the safe length bound, even for a pathological pattern", () => {
			// this only proves the length short-circuit itself is fast — it does not prove the bound
			// protects against catastrophic backtracking in general. See the test below.
			const maliciousValue = `${"a".repeat(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH + 1)}!`;

			const start = Date.now();
			expect(RegexHelper.safeTestRegex(/^(a+)+$/, maliciousValue)).toBe(false);
			expect(Date.now() - start).toBeLessThan(1000);
		});

		it("known limitation: a pathological pattern well below the safe length bound is not short-circuited and still backtracks catastrophically", () => {
			// documents that the 500-char bound does not meaningfully protect against the classic
			// catastrophic-backtracking shape it was written for — that shape already costs real,
			// measurable time well under the bound (this length was independently measured at
			// 200-800ms; the trend is exponential, so 30+ chars is already multi-second). This test's
			// generous timeout exists to tolerate that measured cost, not because a hang is expected —
			// see MOL-22453-release-notes.md for the full measurement and the accepted-limitation writeup.
			const nearMatch = `${"a".repeat(25)}!`;

			expect(RegexHelper.safeTestRegex(/^(a+)+$/, nearMatch)).toBe(false);
		}, 20000);
	});
});
