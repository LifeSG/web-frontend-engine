export namespace RegexHelper {
	// caps the string length tested against a config-supplied regex
	// bounds polynomial backtracking only, not exponential (regex patterns must be trusted)
	export const MAX_MATCHES_INPUT_LENGTH = 1000;

	export const compile = (pattern: string): RegExp | undefined => {
		try {
			const parsed = pattern.match(/^\/(.+)\/([a-z]*)$/i);
			return parsed ? new RegExp(parsed[1], parsed[2]) : new RegExp(pattern);
		} catch {
			return undefined;
		}
	};

	export const safeTestRegex = (regex: RegExp | undefined, value: string): boolean => {
		if (!regex) return false;
		// cap tested value length to bound polynomial regex backtracking cost
		if (value.length > MAX_MATCHES_INPUT_LENGTH) return false;
		return regex.test(value);
	};
}
