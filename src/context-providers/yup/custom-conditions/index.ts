import isBoolean from "lodash/isBoolean";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import { YupHelper } from "../helper";
import "./uinfin";
import { DateTimeHelper } from "../../../utils";
import { IDaysRangeRule } from "../types";

/**
 * empty check that is applicable to numbers too
 */
const isEmptyValue = (value: unknown) => (!isNumber(value) ? isEmpty(value) && !isBoolean(value) : isNil(value));

YupHelper.addCondition("mixed", "filled", (value) => !isEmptyValue(value));
YupHelper.addCondition("mixed", "empty", (value) => isEmptyValue(value));
YupHelper.addCondition("mixed", "equals", (value, match) => !isEmptyValue(value) && isEqual(value, match));
YupHelper.addCondition("mixed", "notEquals", (value, match) => !isEmptyValue(value) && !isEqual(value, match));
YupHelper.addCondition("string", "notMatches", (value: string, regex: string) => {
	if (isEmptyValue(value)) {
		return true;
	}
	const matches = regex.match(/\/(.*)\/([a-z]+)?/);
	const parsedRegex = new RegExp(matches[1], matches[2]);
	return !parsedRegex.test(value);
});
YupHelper.addCondition("array", "includes", (values: unknown[], matches: unknown | unknown[]) => {
	if (!values?.length) return true;
	if (!Array.isArray(matches)) {
		return values.includes(matches);
	} else {
		return matches.filter((m) => values.includes(m)).length === matches.length;
	}
});
YupHelper.addCondition("array", "excludes", (values: unknown[], matches: unknown | unknown[]) => {
	if (!values?.length) return true;
	if (!Array.isArray(matches)) {
		return !values.includes(matches);
	} else {
		return values.length && matches.filter((m) => values.includes(m)).length === 0;
	}
});
YupHelper.addCondition("mixed", "equalsField", (values: unknown[], matches: unknown | unknown[], fn) => {
	switch (typeof values) {
		case "object":
			if (Array.isArray(values) && Array.isArray(fn.parent[`${matches}`])) {
				const a = [...values].sort();
				const b = [...fn.parent[`${matches}`]].sort();
				return isEqual(a, b);
			}
			return isEqual(values, fn.parent[`${matches}`]);
		default:
			return isEqual(values, fn.parent[`${matches}`]);
	}
});
YupHelper.addCondition("mixed", "notEqualsField", (values: unknown[], matches: unknown | unknown[], fn) => {
	switch (typeof values) {
		case "object":
			if (Array.isArray(values) && Array.isArray(fn.parent[`${matches}`])) {
				const a = [...values].sort();
				const b = [...fn.parent[`${matches}`]].sort();
				return !isEqual(a, b);
			}
			return !isEqual(values, fn.parent[`${matches}`]);
		default:
			return !isEqual(values, fn.parent[`${matches}`]);
	}
});

YupHelper.addCondition("mixed", "withinDays", (value: string, withinDays: IDaysRangeRule) => {
	if (isEmpty(value)) return true;
	return DateTimeHelper.checkWithinDays(value, withinDays);
});

YupHelper.addCondition("mixed", "beyondDays", (value: string, beyondDays: IDaysRangeRule) => {
	if (isEmpty(value)) return true;
	return DateTimeHelper.checkBeyondDays(value, beyondDays);
});
