export namespace StyleHelper {
	/** layout-only properties this styling hook is meant to support (e.g. padding-top to clear a masthead). Anything
	 * outside this allowlist is dropped, so there is no property through which a resource can be loaded or the modal
	 * repositioned over other content (background, cursor, list-style, position, z-index, etc.) */
	const ALLOWED_PROPERTIES = new Set([
		"padding",
		"padding-top",
		"padding-right",
		"padding-bottom",
		"padding-left",
		"margin",
		"margin-top",
		"margin-right",
		"margin-bottom",
		"margin-left",
		"width",
		"min-width",
		"max-width",
		"height",
		"min-height",
		"max-height",
		"top",
		"right",
		"bottom",
		"left",
		"border-radius",
	]);

	/** constructs that can reference an external resource or execute an expression, checked after CSS escapes are
	 * resolved so they can't be hidden behind e.g. `\75 rl(` for `url(` */
	const UNSAFE_VALUE_PATTERN = /url\s*\(|image\s*\(|image-set|cross-fade|element\s*\(|expression\s*\(|@import/i;

	/** characters that have no place in a layout value and could break out of a declaration or the inline style */
	const UNSAFE_VALUE_CHARACTERS = /[\\{}<>;@"'`]/;

	/** resolves CSS escape sequences (`\75`, `\000075 `, `\u`) so blocklist checks see what the browser will see */
	const unescapeCss = (value: string): string =>
		value.replace(/\\(?:([0-9a-f]{1,6})[ \t\n\r\f]?|([^\n\r\f0-9a-f]))/gi, (_match, hex: string, char: string) => {
			if (hex) {
				const codePoint = parseInt(hex, 16);
				return codePoint === 0 || codePoint > 0x10ffff ? "�" : String.fromCodePoint(codePoint);
			}
			return char;
		});

	/** splits a style string into declarations on `;` while ignoring `;` inside quotes or brackets, and drops comments.
	 * Does not touch the DOM so it is also safe to run during server-side rendering */
	const splitDeclarations = (value: string): string[] => {
		const declarations: string[] = [];
		let current = "";
		let quote: string | null = null;
		let depth = 0;

		for (let i = 0; i < value.length; i++) {
			const char = value[i];

			if (!quote && char === "/" && value[i + 1] === "*") {
				const end = value.indexOf("*/", i + 2);
				i = end === -1 ? value.length : end + 1;
				continue;
			}
			if (char === "\\") {
				current += char + (value[i + 1] ?? "");
				i++;
				continue;
			}
			if (quote) {
				if (char === quote) quote = null;
			} else if (char === '"' || char === "'") {
				quote = char;
			} else if (char === "(") {
				depth++;
			} else if (char === ")") {
				depth = Math.max(0, depth - 1);
			} else if (char === ";" && depth === 0) {
				declarations.push(current);
				current = "";
				continue;
			}
			current += char;
		}
		declarations.push(current);

		return declarations.map((declaration) => declaration.trim()).filter(Boolean);
	};

	const parseDeclaration = (declaration: string): string | undefined => {
		const separatorIndex = declaration.indexOf(":");
		if (separatorIndex === -1) return undefined;

		const property = unescapeCss(declaration.slice(0, separatorIndex)).trim().toLowerCase();
		if (!ALLOWED_PROPERTIES.has(property)) return undefined;

		const rawValue = declaration.slice(separatorIndex + 1);
		if (UNSAFE_VALUE_CHARACTERS.test(rawValue)) return undefined;

		const value = unescapeCss(rawValue).trim();
		if (!value || UNSAFE_VALUE_PATTERN.test(value) || UNSAFE_VALUE_CHARACTERS.test(value)) return undefined;
		if (!hasBalancedParentheses(value)) return undefined;

		return `${property}: ${value};`;
	};

	/** an unclosed `(` would swallow any declarations after it once the output is parsed by the browser */
	const hasBalancedParentheses = (value: string): boolean => {
		let depth = 0;
		for (const char of value) {
			if (char === "(") depth++;
			else if (char === ")" && --depth < 0) return false;
		}
		return depth === 0;
	};

	/** sanitises a schema-authored CSS string before it is assigned to an element's style.cssText. Rather than stripping
	 * known-bad tokens (bypassable with CSS escapes or non-url() resource functions like image-set()), only declarations
	 * whose property is on a layout-only allowlist and whose value contains no resource-referencing construct are kept.
	 * Rules and at-rules such as `@media` are not supported by style.cssText and are dropped.
	 * Never throws: invalid input results in an empty string */
	export const sanitizeStyleString = (value: unknown): string => {
		if (typeof value !== "string" || !value.trim()) return "";

		try {
			const kept: string[] = [];
			const dropped: string[] = [];

			if (/[{}]/.test(value)) {
				dropped.push(value);
			} else {
				splitDeclarations(value).forEach((declaration) => {
					const sanitised = parseDeclaration(declaration);
					if (sanitised) kept.push(sanitised);
					else dropped.push(declaration);
				});
			}

			if (dropped.length) {
				console.warn(
					`unsupported styles were removed, only layout declarations (e.g. padding-top) are applied: ${dropped.join(
						"; "
					)}`
				);
			}

			return kept.join(" ");
		} catch {
			return "";
		}
	};
}
