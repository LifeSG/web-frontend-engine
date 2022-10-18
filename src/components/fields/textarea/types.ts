import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine/types";

export interface ITextareaSchema
	extends IFrontendEngineBaseFieldJsonSchema<"TEXTAREA">,
		Omit<FormTextareaProps, "id" | "title"> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
