import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface ITimePickerSchema
	extends IFrontendEngineFieldJsonSchema<"time">,
		TComponentNativeProps<TimepickerProps> {
	useCurrentTime?: boolean | undefined;
	is24HourFormat?: boolean | undefined;
}
