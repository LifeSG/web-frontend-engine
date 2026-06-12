import { TypographyProps } from "@lifesg/react-design-system/typography";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TInlineElementSchema } from "../types";

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
