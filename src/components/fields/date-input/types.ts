import { DateInputProps } from "@lifesg/react-design-system/date-input";
import { IYupValidationRule } from "src/components/frontend-engine/yup/types";
import {
	IFrontendEngineBaseFieldJsonSchema,
	TFrontendEngineBaseFieldJsonSchemaKeys,
} from "../../frontend-engine/types";

interface IDateInputValidationRule extends IYupValidationRule {
	future?: boolean | undefined;
	past?: boolean | undefined;
	notFuture?: boolean | undefined;
	notPast?: boolean | undefined;
}

export interface IDateInputSchema
	extends IFrontendEngineBaseFieldJsonSchema<"date", IDateInputValidationRule>,
		Omit<DateInputProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	useCurrentDate?: boolean | undefined;
	dateFormat?: string | undefined;
}
