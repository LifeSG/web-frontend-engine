import { InputSelectProps } from "@lifesg/react-design-system/input-select/types";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface ISelectOption {
	label: string;
	value: string;
}

export interface ISelectSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"select", V>,
		TComponentOmitProps<InputSelectProps<ISelectOption, string>> {}
