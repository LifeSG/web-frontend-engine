import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface IChipOption {
	label: string;
	value: string;
}

export interface IChipsSchema
	extends IFrontendEngineFieldJsonSchema<"chips">,
		TComponentNativeProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
	options: IChipOption[];
	textarea?: {
		label: string;
		validation?: IYupValidationRule[];
		resizable?: boolean;
		maxLength?: number;
		rows?: number;
	};
	multi?: boolean;
}
