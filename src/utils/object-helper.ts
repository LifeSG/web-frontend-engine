import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export namespace ObjectHelper {
	export const containsKey = <K extends string, T>(data: T, key: K): data is T & Record<K, unknown> => {
		return isObject(data) && key in data;
	};
	export const containsLabelValue = <K extends string, T>(data: T, key: K): data is T & Record<K, unknown> => {
		if (isArray(data)) {
			return data.every((item) => containsKey(item, key));
		}
		return containsKey(data, key);
	};
}
