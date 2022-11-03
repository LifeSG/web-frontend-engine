import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import isNaN from "lodash/isNaN";
import { YupHelper } from "../helper";

/**
 * empty check that is applicable to numbers too
 */
const isEmptyValue = (value: unknown) => (isNaN(value) ? isEmpty(String(value)) : isNil(value));

YupHelper.addCondition("mixed", "filled", (value) => !isEmptyValue(value));
YupHelper.addCondition("mixed", "empty", (value) => isEmptyValue(value));
YupHelper.addCondition("mixed", "equals", (value, match) => !isEmptyValue(value) && value === match);
YupHelper.addCondition("mixed", "notEquals", (value, match) => !isEmptyValue(value) && value !== match);
YupHelper.addCondition("array", "includes", (values: unknown[], matches: unknown | unknown[]) => {
	if (!Array.isArray(matches)) {
		return values.includes(matches);
	} else {
		return matches.filter((m) => values.includes(m)).length === matches.length;
	}
});
YupHelper.addCondition("array", "excludes", (values: unknown[], matches: unknown | unknown[]) => {
	if (!Array.isArray(matches)) {
		return !values.includes(matches);
	} else {
		return values.length && matches.filter((m) => values.includes(m)).length === 0;
	}
});
