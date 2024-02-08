import { InputSliderProps } from "@lifesg/react-design-system/input-slider";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface ISliderValidationRule {
    increment?: number | undefined;
}
type TCustomOptions = Pick<InputSliderProps, "showSliderLabels" | "sliderLabelPrefix" | "sliderLabelSuffix">;
export interface ISliderSchema<V = undefined> extends IBaseFieldSchema<"slider", V, ISliderValidationRule>, TComponentOmitProps<Pick<InputSliderProps, "className" | "disabled" | "readOnly" | "ariaLabel">> {
    customOptions?: TCustomOptions | undefined;
}
export {};
