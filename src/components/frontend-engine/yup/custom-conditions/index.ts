import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import { YupHelper } from "../helper";
import "./uinfin";

/**
 * empty check that is applicable to numbers too
 */
const isEmptyValue = (value: unknown) => (!isNumber(value) ? isEmpty(value) : isNil(value));

YupHelper.addCondition("mixed", "filled", (value) => !isEmptyValue(value));
YupHelper.addCondition("mixed", "empty", (value) => isEmptyValue(value));
YupHelper.addCondition("mixed", "equals", (value, match) => !isEmptyValue(value) && isEqual(value, match));
YupHelper.addCondition("mixed", "notEquals", (value, match) => !isEmptyValue(value) && !isEqual(value, match));
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
