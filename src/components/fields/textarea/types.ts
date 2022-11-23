import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup/types";

export interface ITextareaSchema<V = IYupValidationRule>
	extends IFrontendEngineBaseFieldJsonSchema<"textarea", V>,
		TComponentOmitProps<FormTextareaProps> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
