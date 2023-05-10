import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

interface IOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

interface IToggleOption extends IOption {
	none?: boolean;
}

type TCustomOptions =
	| {
			styleType: "default";
	  }
	| {
			styleType: "toggle";
			indicator?: boolean;
			border?: boolean;
	  };
export interface ICheckboxGroupSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"checkbox", V>,
		TComponentOmitProps<CheckboxProps> {
	options: IToggleOption[];
	customOptions?: TCustomOptions;
}
