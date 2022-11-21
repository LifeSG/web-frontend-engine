import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ITimePickerSchema
	extends IFrontendEngineBaseFieldJsonSchema<"time">,
		Omit<TimepickerProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	useCurrentTime?: boolean;
	is24HourFormat?: boolean;
}
