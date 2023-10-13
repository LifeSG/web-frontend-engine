import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
	imgSrc?: string | undefined;
}

type TCustomOptions =
	| {
			styleType: "default";
	  }
	| {
			styleType: "toggle";
			indicator?: boolean | undefined;
			border?: boolean | undefined;
	  }
	| {
			styleType: "image-button";
	  };

export interface IRadioButtonGroupSchema<V = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IOption[];
	customOptions?: TCustomOptions;
}
