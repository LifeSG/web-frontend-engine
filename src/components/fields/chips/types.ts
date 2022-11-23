import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface IChipOption {
	label: string;
	value: string;
}

export interface IChipsSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"chips", V>,
		TComponentOmitProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
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
