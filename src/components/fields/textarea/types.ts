import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import {
	IFrontendEngineBaseFieldJsonSchema,
	TFrontendEngineBaseFieldJsonSchemaKeys,
} from "../../frontend-engine/types";

export interface ITextareaSchema
	extends IFrontendEngineBaseFieldJsonSchema<"TEXTAREA">,
		Omit<FormTextareaProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
