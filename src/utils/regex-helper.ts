export namespace RegexHelper {
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

	export const safeTestRegex = (regex: RegExp | undefined, value: string): boolean => {
		if (!regex) return false;
		if (value.length > MAX_SAFE_PATTERN_INPUT_LENGTH) return false;
		return regex.test(value);
	};
}
