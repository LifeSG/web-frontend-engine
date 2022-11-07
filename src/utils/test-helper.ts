// NOTE: Copied from web-common/utils

export namespace TestHelper {
	export const generateId = (block: string, element?: string | undefined, modifier?: string | number | undefined) => {
		let elementName = block;

		if (element) {
			elementName += `__${element}`;
		}

		if (modifier) {
			elementName += `--${modifier}`;
		}

		return elementName;
	};

	export const getError = (fn: () => unknown) => {
		try {
			return fn();
		} catch (error) {
			return error;
		}
	};
}
