import { DateRangeInputProps } from "@lifesg/react-design-system/date-range-input";
import {
	IFrontendEngineBaseFieldJsonSchema,
	IYupValidationRule,
	TComponentOmitProps,
} from "../../frontend-engine/types";

export interface IDateRangeFieldValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	minDate?: string | undefined;
	maxDate?: string | undefined;
	excludedDates?: string[] | undefined;
}

interface IDateRangeFieldValidationRuleNever {
	future: never;
	past: never;
	minDate: never;
	maxDate: never;
	excludedDates: never;
}
interface WeekSchema<V = undefined>
	extends Omit<IFrontendEngineBaseFieldJsonSchema<"date-range-field", V, undefined>, "validation">,
		TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
	variant: "week";
	dateFormat?: string | undefined;
	validation?: (V | IYupValidationRule | IDateRangeFieldValidationRuleNever)[];
}

interface RangeSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"date-range-field", V, IDateRangeFieldValidationRule>,
		TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
	variant: "range";
	dateFormat?: string | undefined;
}

export type IDateRangeFieldSchema<V = undefined> = RangeSchema<V> | WeekSchema<V>;

export enum TDateRangeInputType {
	START = "start",
	END = "end",
}
