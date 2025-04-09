import { V2_TextProps } from "@lifesg/react-design-system/v2_text";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema, TInlineElementSchema } from "../types";
export type TTextType = "text-d1" | "text-d2" | "text-dbody" | "text-h1" | "text-h2" | "text-h3" | "text-h4" | "text-h5" | "text-h6" | "text-body" | "text-bodysmall" | "text-xsmall";
export interface ITextSchema extends IBaseElementSchema<TTextType>, TComponentOmitProps<V2_TextProps, "children"> {
    children: string | string[] | Record<string, ITextSchema | TInlineElementSchema>;
}
