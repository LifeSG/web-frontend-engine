import { HistogramSliderProps } from "@lifesg/react-design-system/histogram-slider";
import { TComponentOmitProps } from "../../frontend-engine";
import { IHistogramValidationRule } from "../histogram-slider";
import { IBaseFieldSchema } from "../types";

type TCustomOptions = Pick<HistogramSliderProps, "rangeLabelPrefix" | "rangeLabelSuffix">;

export interface ISelectHistogramSchema<V = undefined>
	extends IBaseFieldSchema<"select-histogram", V, IHistogramValidationRule>,
		TComponentOmitProps<Pick<HistogramSliderProps, "className" | "disabled" | "readOnly" | "bins" | "interval">> {
	customOptions?: TCustomOptions | undefined;
}
