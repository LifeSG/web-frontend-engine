import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup";

export interface IDateInputValidationRule extends IYupValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
}

export interface IDateInputSchema<V = IDateInputValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"date", V>,
		TComponentOmitProps<DateInputProps> {
	useCurrentDate?: boolean | undefined;
	dateFormat?: string | undefined;
}
