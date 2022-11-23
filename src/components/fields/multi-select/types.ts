import { InputMultiSelectProps } from "@lifesg/react-design-system";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface IMultiSelectOption {
	label: string;
	value: string;
}

export interface IMultiSelectSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"multi-select", V>,
		TComponentOmitProps<InputMultiSelectProps<IMultiSelectOption, string>> {}
