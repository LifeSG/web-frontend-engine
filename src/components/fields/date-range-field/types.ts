import { DateRangeInputProps } from "@lifesg/react-design-system/date-range-input";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";

export interface IDateRangeFieldValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	minDate?: string | undefined;
	maxDate?: string | undefined;
	excludedDates?: string[] | undefined;
}
interface WeekSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"date-range-field", V, undefined>,
		TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
	variant: "week";
	dateFormat?: string | undefined;
}

interface RangeSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"date-range-field", V, IDateRangeFieldValidationRule>,
		TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
	variant: "range";
	dateFormat?: string | undefined;
}

export type TDateRangeFieldSchema<V = undefined> = RangeSchema<V> | WeekSchema<V>;

export enum TDateRangeInputType {
	START = "start",
	END = "end",
}
