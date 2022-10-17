import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine/types";

export interface ITextareaSchema
	extends IFrontendEngineBaseFieldJsonSchema<"TEXTAREA">,
		Omit<FormTextareaProps, "id" | "title"> {
	chipTexts?: string[];
	chipPosition?: "top" | "bottom";
	resizable?: boolean;
}
