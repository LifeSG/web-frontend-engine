import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IYupValidationRule, TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
import { IWithinDaysRule } from "../../../context-providers";

export interface IDateFieldValidationRule extends IYupValidationRule {
	dateFormat?: boolean | undefined;
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
	minDate?: string | undefined;
	maxDate?: string | undefined;
	excludedDates?: string[] | undefined;
	withinDays?: IWithinDaysRule | undefined;
}

export interface IDateFieldSchema<V = undefined>
	extends IBaseFieldSchema<"date-field", V, IDateFieldValidationRule>,
		TComponentOmitProps<DateInputProps, "minDate" | "maxDate" | "disabledDates"> {
	useCurrentDate?: boolean | undefined;
	dateFormat?: string | undefined;
}
