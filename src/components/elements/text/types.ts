import { TextProps } from "@lifesg/react-design-system/text";
import { IFrontendEngineElementJsonSchema, TComponentNativeProps } from "../../frontend-engine";

export type TTextType =
	| "D1"
	| "D2"
	| "DBody"
	| "H1"
	| "H2"
	| "H3"
	| "H4"
	| "H5"
	| "H6"
	| "Body"
	| "BodySmall"
	| "XSmall";

export interface ITextSchema
	extends IFrontendEngineElementJsonSchema<TTextType>,
		TComponentNativeProps<TextProps, "children"> {
	children: string | string[] | Record<string, ITextSchema>;
}
