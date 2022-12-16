import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface IChipOption {
	label: string;
	value: string;
}

export interface IChipsSchema
	extends IFrontendEngineBaseFieldJsonSchema<"chips">,
		React.ButtonHTMLAttributes<HTMLButtonElement> {
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
