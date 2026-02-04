import { PopoverInlineProps } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { ITextSchema, ITypographySchema } from "../text";
import { IBaseElementSchema, TBlockElementSchema, TInlineElementSchema } from "../types";
import { IInlineWrapperSchema, TWrapperSchema } from "../wrapper";

interface IPopoverHint extends Pick<PopoverInlineProps, "position" | "customOffset" | "zIndex"> {
	content:
		| string
		| Record<
				string,
				| ITextSchema
				| ITypographySchema
				| IInlineWrapperSchema
				| TBlockElementSchema
				| TInlineElementSchema
				| TWrapperSchema
		  >;
}

export interface IPopoverSchema
	extends IBaseElementSchema<"popover">,
		Pick<PopoverInlineProps, "trigger" | "underlineStyle" | "underlineHoverStyle"> {
	children?: string | undefined;
	className?: string | undefined;
	hint: IPopoverHint;
	icon?: keyof typeof Icons | undefined;
}
