import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";

export interface IDateInputValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
}

export interface IDateInputSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"date", V, IDateInputValidationRule>,
		TComponentOmitProps<DateInputProps> {
	useCurrentDate?: boolean | undefined;
	dateFormat?: string | undefined;
}
