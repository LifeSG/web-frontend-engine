import isObject from "lodash/isObject";

export namespace ObjectHelper {
	export const containsKey = <K extends string, T>(data: T, key: K): data is T & Record<K, unknown> => {
		return isObject(data) && key in data;
	};
	export const isStringArray = (array: unknown[]): array is string[] => {
		return array.every((item) => typeof item === "string");
	};
}
