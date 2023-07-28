import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
export interface IDateFieldValidationRule {
    future?: boolean | undefined;
    past?: boolean | undefined;
    notFuture?: boolean | undefined;
    notPast?: boolean | undefined;
    minDate?: string | undefined;
    maxDate?: string | undefined;
}
export interface IDateFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"date-field", V, IDateFieldValidationRule>, TComponentOmitProps<DateInputProps> {
    useCurrentDate?: boolean | undefined;
    dateFormat?: string | undefined;
}
