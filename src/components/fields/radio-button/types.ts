import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import type { IPopoverSchema, ITextSchema } from "../../elements";
import type { IInlineWrapperSchema } from "../../elements/wrapper";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface IRadioButtonOption {
	label: string | Record<string, ITextSchema | IPopoverSchema | IInlineWrapperSchema>;
	value: string;
	disabled?: boolean | undefined;
}

interface IToggleOption<V = undefined, C = undefined> extends IRadioButtonOption {
	children?: Record<string, TFrontendEngineFieldSchema<V, C>> | undefined;
	subLabel?: string | undefined;
}

interface IImageButtonOption extends IRadioButtonOption {
	imgSrc?: string | undefined;
}

export type TRadioToggleLayoutType = "horizontal" | "vertical";

interface IRadioButtonDefaultSchema<V = undefined>
	extends IBaseFieldSchema<"radio", V>,
		TComponentOmitProps<RadioButtonProps> {
	options: IRadioButtonOption[];
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
