// NOTE: Copied from web-common/utils

export namespace TestHelper {
	export const generateId = (block: string, element?: string, modifier?: string | number) => {
		let elementName = block;

		if (element) {
			elementName += `__${element}`;
		}

		if (modifier) {
			elementName += `--${modifier}`;
		}

		return elementName;
	};
}
