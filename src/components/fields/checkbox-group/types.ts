import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

export interface IToggleOption<V = undefined, C = undefined> extends IOption {
	none?: boolean | undefined;
	children?: Record<string, TFrontendEngineFieldSchema<V, C>> | undefined;
}

export type TCheckboxToggleLayoutType = "horizontal" | "vertical";

interface ICheckboxGroupDefaultSchema<V = undefined>
	extends IBaseFieldSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IOption[];
	customOptions?: { styleType: "default" } | undefined;
}

interface ICheckboxGroupToggleSchema<V = undefined, C = undefined>
	extends IBaseFieldSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IToggleOption<V, C>[];
	customOptions: {
		styleType: "toggle";
		indicator?: boolean | undefined;
		border?: boolean | undefined;
		layoutType?: TCheckboxToggleLayoutType | undefined;
	};
}

export type TCheckboxGroupSchema<V = undefined, C = undefined> =
	| ICheckboxGroupDefaultSchema<V>
	| ICheckboxGroupToggleSchema<V, C>;

/** @deprecated will be removed in a future release. Use `TCheckboxGroupSchema` instead */
export type ICheckboxGroupSchema<V = undefined, C = undefined> =
	| ICheckboxGroupDefaultSchema<V>
	| ICheckboxGroupToggleSchema<V, C>;
