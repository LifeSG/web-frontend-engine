import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface IChipOption {
	label: string;
	value: string;
}

export interface IChipsSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"chips", V>,
		TComponentOmitProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
	options: IChipOption[];
	textarea?: {
		label: string;
		validation?: (V | IYupValidationRule)[];
		resizable?: boolean;
		maxLength?: number;
		rows?: number;
		placeholder?: string;
	};
	multi?: boolean;
}
