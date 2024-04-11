import { DateRangeInputProps } from "@lifesg/react-design-system/date-range-input";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IDateRangeFieldValidationRule {
    future?: boolean | undefined;
    past?: boolean | undefined;
    notFuture?: boolean | undefined;
    notPast?: boolean | undefined;
    minDate?: string | undefined;
    maxDate?: string | undefined;
    excludedDates?: string[] | undefined;
    numberOfDays?: number | undefined;
}
interface WeekSchema<V = undefined> extends IBaseFieldSchema<"date-range-field", V, undefined>, TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
    variant: "week";
    dateFormat?: string | undefined;
}
interface RangeSchema<V = undefined> extends IBaseFieldSchema<"date-range-field", V, IDateRangeFieldValidationRule>, TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
    variant: "range";
    dateFormat?: string | undefined;
}
interface FixedRangeSchema<V = undefined> extends IBaseFieldSchema<"date-range-field", V, IDateRangeFieldValidationRule>, TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
    variant: "fixed-range";
    dateFormat?: string | undefined;
}
export type TDateRangeFieldSchema<V = undefined> = RangeSchema<V> | WeekSchema<V> | FixedRangeSchema<V>;
export declare enum TDateRangeInputType {
    START = "start",
    END = "end"
}
export {};
