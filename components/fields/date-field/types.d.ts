import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IDateFieldValidationRule {
    future?: boolean | undefined;
    past?: boolean | undefined;
    notFuture?: boolean | undefined;
    notPast?: boolean | undefined;
    minDate?: string | undefined;
    maxDate?: string | undefined;
    excludedDates?: string[] | undefined;
}
export interface IDateFieldSchema<V = undefined> extends IBaseFieldSchema<"date-field", V, IDateFieldValidationRule>, TComponentOmitProps<DateInputProps, "minDate" | "maxDate" | "disabledDates"> {
    useCurrentDate?: boolean | undefined;
    dateFormat?: string | undefined;
}
