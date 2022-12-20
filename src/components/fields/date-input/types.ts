import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup";

interface IDateInputValidationRule extends IYupValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
}

export interface IDateInputSchema
	extends IFrontendEngineFieldJsonSchema<"date", IDateInputValidationRule>,
		TComponentNativeProps<DateInputProps> {
	useCurrentDate?: boolean | undefined;
	dateFormat?: string | undefined;
}
