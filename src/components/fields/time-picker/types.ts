import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface ITimePickerSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"time", V>,
		TComponentOmitProps<TimepickerProps> {
	useCurrentTime?: boolean | undefined;
	is24HourFormat?: boolean | undefined;
}
