import isBoolean from "lodash/isBoolean";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import { LocalDate } from "@js-joda/core";
import { YupHelper } from "../helper";
import { DateTimeHelper } from "../../../utils";
import "./uinfin";

/**
 * empty check that is applicable to numbers too
 */
const isEmptyValue = (value: unknown) => (!isNumber(value) ? isEmpty(value) && !isBoolean(value) : isNil(value));

YupHelper.addCondition("mixed", "filled", (value) => !isEmptyValue(value));
YupHelper.addCondition("mixed", "empty", (value) => isEmptyValue(value));
YupHelper.addCondition("mixed", "equals", (value, match) => !isEmptyValue(value) && isEqual(value, match));
YupHelper.addCondition("mixed", "notEquals", (value, match) => !isEmptyValue(value) && !isEqual(value, match));
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
			return Array.isArray(values) && Array.isArray(fn.parent[`${matches}`])
				? isEqual(values?.sort(), fn.parent[`${matches}`]?.sort())
				: isEqual(values, fn.parent[`${matches}`]);
		default:
			return isEqual(values, fn.parent[`${matches}`]);
	}
});

YupHelper.addCondition(
	"mixed",
	"withinDays",
	(
		value: string,
		withinDays: {
			numberOfDays: number;
			specificDate?: string;
			dateFormat?: string;
		}
	) => {
		if (!value) return true;
		const { numberOfDays, specificDate, dateFormat = "yyyy-MM-dd" } = withinDays;
		const localDate = DateTimeHelper.toLocalDateOrTime(value, dateFormat, "date");
		if (!localDate) return false;
		let startDate: LocalDate;
		let endDate: LocalDate;
		if (specificDate) {
			startDate = DateTimeHelper.toLocalDateOrTime(specificDate, dateFormat, "date");
			if (!startDate) return false;
			endDate = startDate.plusDays(numberOfDays);
		} else {
			const today = LocalDate.now();
			if (numberOfDays >= 0) {
				startDate = today;
				endDate = today.plusDays(numberOfDays);
			} else {
				startDate = today.plusDays(numberOfDays);
				endDate = today;
			}
		}
		return !localDate.isBefore(startDate) && !localDate.isAfter(endDate);
	}
);
