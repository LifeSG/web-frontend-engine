import { DateRangeInputProps } from "@lifesg/react-design-system/date-range-input";
import { Variant } from "@lifesg/react-design-system/shared/internal-calendar/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";

export interface IDateRangeFieldValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
	minDate?: string | undefined;
	maxDate?: string | undefined;
	excludedDates?: string[] | undefined;
}

export interface IDateRangeFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"date-range-field", V, IDateRangeFieldValidationRule>,
		TComponentOmitProps<DateRangeInputProps, "valueEnd"> {
	dateFormat?: string | undefined;
	variant?: Exclude<Variant, "single"> | undefined;
}
