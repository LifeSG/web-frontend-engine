import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
	imgSrc?: string | undefined;
	children?: Record<string, TFrontendEngineFieldSchema> | undefined;
}

export type TRadioToggleLayoutType = "horizontal" | "vertical";

type TCustomOptions =
	| {
			styleType: "default";
	  }
	| {
			styleType: "toggle";
			indicator?: boolean | undefined;
			border?: boolean | undefined;
			layoutType?: TRadioToggleLayoutType | undefined;
	  }
	| {
			styleType: "image-button";
	  };

// TODO: discriminating union to differentiate extended props between different styleType
export interface IRadioButtonGroupSchema<V = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IOption[];
	customOptions?: TCustomOptions | undefined;
}
