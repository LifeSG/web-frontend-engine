import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

interface IToggleOption<V = undefined, C = undefined> extends IOption {
	children?: Record<string, TFrontendEngineFieldSchema<V, C>> | undefined;
}

interface IImageButtonOption extends IOption {
	imgSrc?: string | undefined;
}

export type TRadioToggleLayoutType = "horizontal" | "vertical";

interface IRadioButtonDefaultSchema<V = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IOption[];
	customOptions?:
		| {
				styleType: "default";
		  }
		| undefined;
}

interface IRadioButtonToggleSchema<V = undefined, C = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IToggleOption<V, C>[];
	customOptions: {
		styleType: "toggle";
		indicator?: boolean | undefined;
		border?: boolean | undefined;
		layoutType?: TRadioToggleLayoutType | undefined;
	};
}

interface IRadioButtonImageButtonSchema<V = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IImageButtonOption[];
	customOptions: {
		styleType: "image-button";
	};
}

export type TRadioButtonGroupSchema<V = undefined, C = undefined> =
	| IRadioButtonDefaultSchema<V>
	| IRadioButtonToggleSchema<V, C>
	| IRadioButtonImageButtonSchema<V>;

/** @deprecated will be removed in a future release. Use `TRadioButtonGroupSchema` instead */
export type IRadioButtonGroupSchema<V = undefined, C = undefined> =
	| IRadioButtonDefaultSchema<V>
	| IRadioButtonToggleSchema<V, C>
	| IRadioButtonImageButtonSchema<V>;
