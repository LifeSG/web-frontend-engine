import { InputRangeSelectProps } from "@lifesg/react-design-system/input-range-select/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface IRangeSelectOption {
	label: string;
	value: string;
}

export interface IRangeSelectSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"range-select", V>,
		TComponentOmitProps<InputRangeSelectProps<IRangeSelectOption, string>> {}
