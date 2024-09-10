import { SelectHistogramProps, SelectHistogramSliderProps } from "@lifesg/react-design-system/select-histogram";
import { IYupValidationRule, TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface ISelectHistogramValidationRule extends IYupValidationRule {
    /** to customise error message if the values match bins and interval */
    bin?: boolean | undefined;
    /** to customise error message if the values are not incremental */
    incremental?: boolean | undefined;
    /** to customise error message if the values out of range */
    withinRange?: boolean | undefined;
}
type TCustomOptions = Pick<SelectHistogramProps, "rangeLabelPrefix" | "rangeLabelSuffix">;
export interface ISelectHistogramSchema<V = undefined> extends IBaseFieldSchema<"select-histogram", V, ISelectHistogramValidationRule>, TComponentOmitProps<Pick<SelectHistogramProps, "className" | "disabled" | "readOnly" | "value">> {
    customOptions?: TCustomOptions | undefined;
    histogramSlider: Pick<SelectHistogramSliderProps, "bins" | "interval">;
}
export {};
