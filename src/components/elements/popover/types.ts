import { PopoverInlineProps } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { ReactElement } from "react";
import { IBaseElementSchema } from "../types";

export enum PopoverHintType {
	DEFAULT = "default",
	IMAGE = "image",
	COMPONENT = "component",
}

interface IPopoverHint extends Pick<PopoverInlineProps, "position" | "customOffset" | "zIndex"> {
	content: string | ReactElement;
	type?: PopoverHintType;
}

export interface IPopoverSchema
	extends IBaseElementSchema<"popover">,
		Pick<PopoverInlineProps, "trigger" | "underlineStyle" | "underlineHoverStyle"> {
	children?: string | undefined;
	className?: string | undefined;
	hint: IPopoverHint;
	icon?: keyof typeof Icons | undefined;
}
