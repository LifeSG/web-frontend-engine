import { InputNestedMultiSelectProps } from "@lifesg/react-design-system/input-nested-multi-select";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
import { InputNestedSelectProps } from "@lifesg/react-design-system";

export interface INestedMultiSelectOption {
	label: string;
	value: {
		id: number;
		name: string;
	};
}

export interface INestedMultiSelectSchema<V = undefined>
	extends IBaseFieldSchema<"nested-multi-select", V>,
		TComponentOmitProps<InputNestedMultiSelectProps<INestedMultiSelectOption, string, string>> {}
