import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";

export interface IChipsSchema
	extends IFrontendEngineBaseFieldJsonSchema<"chips">,
		React.ButtonHTMLAttributes<HTMLButtonElement> {
	chipTexts: string[];
	textAreaChipName?: string;
	showTextAreaChip?: boolean;
	isTextAreaRequired?: boolean;
	isSingleSelection?: boolean;
	resizable?: boolean;
	maxLength?: number;
	rows?: number;
}
