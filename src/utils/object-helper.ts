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

	export const getNestedData = <T>(key: string, data: Record<string, T>): Record<string, T> => {
		if (key in data) {
			return { [key]: data[key] };
		}

		for (const [_, value] of Object.entries(data)) {
			if (typeof value === "object") {
				return getNestedData(key, value as unknown as Record<string, T>);
			}
		}
	};
}
