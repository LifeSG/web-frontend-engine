import { IFrontendEngineBaseFieldJsonSchema } from "../../types";

export interface ITextareaSchema extends IFrontendEngineBaseFieldJsonSchema {
	type: "TEXTAREA";
	maxLength?: number;
	chipTexts?: string[];
	chipPosition?: "top" | "bottom";
	rows?: number;
	resizable?: boolean;
}

export interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	id: string;
	maxLength?: number;
	chipTexts?: string[];
	chipPosition?: "top" | "bottom";
	resizable?: boolean;
	rows?: number;
}
