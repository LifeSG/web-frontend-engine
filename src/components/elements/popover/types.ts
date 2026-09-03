import { PopoverInlineProps } from "@lifesg/react-design-system/popover";
import * as Icons from "@lifesg/react-icons";
import { ITypographySchema } from "../typography";
import { IBaseElementSchema, TBlockElementSchema, TInlineElementSchema } from "../types";
import { IInlineWrapperSchema, TWrapperSchema } from "../wrapper";

interface IPopoverHint extends Pick<PopoverInlineProps, "position" | "customOffset" | "zIndex"> {
	content:
		| string
		| Record<
				string,
				ITypographySchema | IInlineWrapperSchema | TBlockElementSchema | TInlineElementSchema | TWrapperSchema
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
