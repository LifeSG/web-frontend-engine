import { TextProps } from "@lifesg/react-design-system/text";
import { IFrontendEngineElementJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export interface ITextbodySchema
	extends IFrontendEngineElementJsonSchema<"textbody">,
		TComponentNativeProps<TextProps, "children"> {
	children: string | string[] | Record<string, ITextbodySchema>;
}
