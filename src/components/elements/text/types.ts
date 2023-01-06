import { TextProps } from "@lifesg/react-design-system/text";
import { IFrontendEngineElementJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export type TTextType =
	| "text-d1"
	| "text-d2"
	| "text-dbody"
	| "text-h1"
	| "text-h2"
	| "text-h3"
	| "text-h4"
	| "text-h5"
	| "text-h6"
	| "text-body"
	| "text-bodysmall"
	| "text-xsmall";

export interface ITextSchema
	extends IFrontendEngineElementJsonSchema<TTextType>,
		TComponentNativeProps<TextProps, "children"> {
	children: string | string[] | Record<string, ITextSchema>;
}
