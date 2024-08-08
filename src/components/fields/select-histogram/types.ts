import { HistogramSliderProps } from "@lifesg/react-design-system/histogram-slider";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

type TCustomOptions = Pick<HistogramSliderProps, "rangeLabelPrefix" | "rangeLabelSuffix">;

export interface ISelectHistogramSchema<V = undefined>
	extends IBaseFieldSchema<"select-histogram", V>,
		TComponentOmitProps<Pick<HistogramSliderProps, "className" | "disabled" | "readOnly" | "bins" | "interval">> {
	customOptions?: TCustomOptions | undefined;
}
