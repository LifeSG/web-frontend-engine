import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine/types";

export interface ITextareaSchema
	extends IFrontendEngineFieldJsonSchema<"textarea">,
		TComponentNativeProps<FormTextareaProps> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
