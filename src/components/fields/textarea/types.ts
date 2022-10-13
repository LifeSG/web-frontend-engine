import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine/types";

export interface ITextareaSchema extends IFrontendEngineBaseFieldJsonSchema {
	type: "TEXTAREA";
	maxLength?: number;
	chipTexts?: string[];
	chipPosition?: "top" | "bottom";
	rows?: number;
	resizable?: boolean;
}
