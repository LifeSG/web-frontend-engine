import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface ITimeFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"time-field", V>,
		TComponentOmitProps<TimepickerProps> {
	useCurrentTime?: boolean | undefined;
	is24HourFormat?: boolean | undefined;
}
