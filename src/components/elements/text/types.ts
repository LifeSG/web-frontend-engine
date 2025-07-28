import { TypographyProps } from "@lifesg/react-design-system/typography/types";
import { V2_TextProps } from "@lifesg/react-design-system/v2_text/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TInlineElementSchema } from "../types";

/**
 * @deprecated Use design system v3 TTypographyType
 */
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

/**
 * @deprecated Use design system v3 ITypographySchema
 */
export interface ITextSchema extends IBaseElementSchema<TTextType>, TComponentOmitProps<V2_TextProps, "children"> {
	children: string | string[] | Record<string, ITextSchema | TInlineElementSchema>;
}

export type TTypographyType =
	| "heading-xxl"
	| "heading-xl"
	| "heading-md"
	| "heading-sm"
	| "heading-lg"
	| "heading-xs"
	| "body-md"
	| "body-sm"
	| "body-bl"
	| "body-xs";

export interface ITypographySchema
	extends IBaseElementSchema<TTypographyType>,
		TComponentOmitProps<TypographyProps, "children"> {
	children: string | string[] | Record<string, ITypographySchema | TInlineElementSchema>;
}
