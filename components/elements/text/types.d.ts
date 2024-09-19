import { TextProps } from "@lifesg/react-design-system/text";
import { TComponentOmitProps } from "../../frontend-engine";
import { IPopoverSchema } from "../popover/types";
import { IBaseElementSchema } from "../types";
export type TTextType = "text-d1" | "text-d2" | "text-dbody" | "text-h1" | "text-h2" | "text-h3" | "text-h4" | "text-h5" | "text-h6" | "text-body" | "text-bodysmall" | "text-xsmall";
export interface ITextSchema extends IBaseElementSchema<TTextType>, TComponentOmitProps<TextProps, "children"> {
    children: string | string[] | Record<string, ITextSchema | IPopoverSchema>;
}
