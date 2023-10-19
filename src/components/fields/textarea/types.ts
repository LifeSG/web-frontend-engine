import { FormTextareaProps } from "@lifesg/react-design-system/form/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface ITextareaSchema<V = undefined>
	extends IBaseFieldSchema<"textarea", V>,
		TComponentOmitProps<FormTextareaProps, "maxLength"> {
	chipTexts?: string[] | undefined;
	chipPosition?: "top" | "bottom" | undefined;
	resizable?: boolean | undefined;
}
