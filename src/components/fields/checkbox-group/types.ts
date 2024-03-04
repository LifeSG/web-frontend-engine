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
	  }
	| {
			styleType: "toggle";
			indicator?: boolean | undefined;
			border?: boolean | undefined;
			layoutType?: TCheckboxToggleLayoutType | undefined;
	  };
export interface ICheckboxGroupSchema<V = undefined>
	extends IBaseFieldSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IToggleOption[];
	customOptions?: TCustomOptions;
}
