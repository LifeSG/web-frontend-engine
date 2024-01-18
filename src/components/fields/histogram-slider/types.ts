import { HistogramSliderProps } from "@lifesg/react-design-system/histogram-slider";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

type TCustomOptions = Pick<HistogramSliderProps, "showRangeLabels" | "rangeLabelPrefix" | "rangeLabelSuffix">;

export interface IHistogramSliderValue {
	from: number | undefined;
	to: number | undefined;
}

export interface IHistogramSliderSchema<V = undefined>
	extends IBaseFieldSchema<"histogram-slider", V>,
		TComponentOmitProps<Pick<HistogramSliderProps, "className" | "disabled" | "readOnly" | "bins" | "interval">> {
	customOptions?: TCustomOptions | undefined;
}
