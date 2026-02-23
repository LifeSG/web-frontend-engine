import { TimepickerProps } from "@lifesg/react-design-system/timepicker";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface ITimeFieldSchema<V = undefined> extends IBaseFieldSchema<"time-field", V>, TComponentOmitProps<TimepickerProps> {
    useCurrentTime?: boolean | undefined;
    is24HourFormat?: boolean | undefined;
}
