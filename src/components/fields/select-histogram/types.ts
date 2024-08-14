import { SelectHistogramProps } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import { IHistogramValidationRule } from "../histogram-slider";
import { IBaseFieldSchema } from "../types";

type TCustomOptions = Pick<SelectHistogramProps, "rangeLabelPrefix" | "rangeLabelSuffix">;

export interface ISelectHistogramSchema<V = undefined>
	extends IBaseFieldSchema<"select-histogram", V, IHistogramValidationRule>,
		TComponentOmitProps<
			Pick<SelectHistogramProps, "className" | "disabled" | "readOnly" | "value" | "histogramSlider">
		> {
	customOptions?: TCustomOptions | undefined;
}
