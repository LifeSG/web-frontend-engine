import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface ITimePickerSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"time", V>,
		TComponentOmitProps<TimepickerProps> {
	useCurrentTime?: boolean | undefined;
	is24HourFormat?: boolean | undefined;
}
