import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";

export interface ITextareaSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"textarea", V>,
		TComponentOmitProps<FormTextareaProps, "maxLength"> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
