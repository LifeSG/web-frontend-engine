import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface IChipOption {
	label: string;
	value: string;
	disabled?: boolean | undefined;
}

export interface IChipsSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"chips", V>,
		TComponentOmitProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {
	options: IChipOption[];
	textarea?: {
		label: string;
		validation?: (V | IYupValidationRule)[];
		resizable?: boolean;
		rows?: number;
		placeholder?: string;
	};
}
