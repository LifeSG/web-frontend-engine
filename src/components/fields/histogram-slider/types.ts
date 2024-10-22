import { HistogramSliderProps } from "@lifesg/react-design-system/histogram-slider";
import { IYupValidationRule, TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

type TCustomOptions = Pick<HistogramSliderProps, "showRangeLabels" | "rangeLabelPrefix" | "rangeLabelSuffix">;

export interface IHistogramValidationRule extends IYupValidationRule {
	/** to customise error message if the values match bins and interval */
	bin?: boolean | undefined;
	/** to customise error message if the values are not incremental */
	incremental?: boolean | undefined;
	/** to customise error message if the values out of range */
	withinRange?: boolean | undefined;
}

export interface IHistogramSliderValue {
	from: number | undefined;
	to: number | undefined;
}

export interface IHistogramSliderSchema<V = undefined>
	extends IBaseFieldSchema<"histogram-slider", V, IHistogramValidationRule>,
		TComponentOmitProps<
			Pick<HistogramSliderProps, "className" | "disabled" | "readOnly" | "bins" | "interval" | "ariaLabels">
		> {
	customOptions?: TCustomOptions | undefined;
}
