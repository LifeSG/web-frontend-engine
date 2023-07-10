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
					return getNestedValueByKey(value as Record<string, T>, key);
				}
			}
		}

		return {};
	};
}
