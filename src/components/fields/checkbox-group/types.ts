import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

interface IToggleOption extends IOption {
	none?: boolean;
}

export type TCheckboxToggleLayoutType = "horizontal" | "vertical";

type TCustomOptions =
	| {
			styleType: "default";
			layoutType?: TCheckboxToggleLayoutType;
	  }
	| {
			styleType: "toggle";
			indicator?: boolean;
			border?: boolean;
			layoutType?: TCheckboxToggleLayoutType;
	  };
export interface ICheckboxGroupSchema<V = undefined>
	extends IBaseFieldSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IToggleOption[];
	customOptions?: TCustomOptions;
}
