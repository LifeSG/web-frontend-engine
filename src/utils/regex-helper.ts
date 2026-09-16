export namespace RegexHelper {
	/** upper bound on the string length tested against a schema-authored regex pattern.
	 * A genuinely pathological pattern can still backtrack catastrophically below this length,
	 * but bounding it caps the worst-case cost for the common cases (filenames, form field values,
	 * short keystroke buffers) this is applied against. */
	export const MAX_SAFE_PATTERN_INPUT_LENGTH = 500;

	/** parses a `/pattern/flags`-style string into a RegExp, matching the convention already used
	 * across the codebase for schema-authored regex config. Returns undefined instead of throwing
	 * on an invalid pattern. */
	export const parseMatchesPattern = (pattern: string): RegExp | undefined => {
		try {
			const parsed = pattern.match(/^\/(.+)\/([a-z]*)$/i);
			return parsed ? new RegExp(parsed[1], parsed[2]) : new RegExp(pattern);
		} catch {
			return undefined;
		}
	};

	/** tests `value` against `regex`, bailing out instead of running .test() when `value` exceeds
	 * MAX_SAFE_PATTERN_INPUT_LENGTH. Reduces (but does not eliminate) worst-case ReDoS exposure for
	 * schema-authored patterns tested against attacker-influenceable strings. */
	export const safeTestRegex = (regex: RegExp | undefined, value: string): boolean => {
		if (!regex) return false;
		if (value.length > MAX_SAFE_PATTERN_INPUT_LENGTH) return false;
		return regex.test(value);
	};
}
