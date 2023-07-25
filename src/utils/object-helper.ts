import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

export namespace ObjectHelper {
	export const upsert = <T>(data: Record<string, T>, key: string, value: T): Record<string, T> => {
		const updatedData = { ...data };

		if (!(key in updatedData)) {
			updatedData[key] = value;
		} else {
			updatedData[key] = {
				...updatedData[key],
				...value,
			};
		}

		return updatedData;
	};

	interface GetNestedValueByKeyOptions {
		/** whether to skip searching at root level */
		skipRoot?: boolean | undefined;
		/** restrict which nested keys to find in */
		searchIn?: string[] | undefined;
	}
	export const getNestedValueByKey = <T>(
		data: Record<string, T>,
		key: string,
		options: GetNestedValueByKeyOptions = {}
	): Record<string, T> => {
		const { skipRoot, searchIn } = options;
		if (!skipRoot && key in data) {
			return { [key]: data[key] };
		}

		for (const [parentKey, value] of Object.entries(data)) {
			if (typeof value === "object") {
				if (!searchIn || searchIn.includes(parentKey)) {
					const matches = getNestedValueByKey(value as Record<string, T>, key, {
						...options,
						skipRoot: false,
					});
					if (!isEmpty(matches)) return matches;
				}
			}
		}
	};

	/**
	 * removes undefined, null, {}, []
	 */
	export const removeNil = (data: unknown) => {
		if (data === null) {
			return undefined;
		} else if (Array.isArray(data)) {
			const newData = data.map((v) => removeNil(v)).filter((v) => v);
			return newData.length ? newData : undefined;
		} else if (typeof data === "object") {
			const newData = { ...data };
			Object.entries(newData).forEach(([key, value]) => {
				const newValue = removeNil(value);
				if (isNil(newValue)) {
					delete newData[key];
				} else {
					newData[key] = newValue;
				}
			});
			if (!isEmpty(newData)) return newData;
			return undefined;
		}
		return data;
	};
}
