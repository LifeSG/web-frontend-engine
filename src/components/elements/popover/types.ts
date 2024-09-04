import { PopoverV2TriggerType } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { IBaseElementSchema } from "../types";

interface IPopoverHint {
	content: string;
	zIndex?: number | undefined;
}

export interface IPopoverSchema extends IBaseElementSchema<"popover"> {
	children: string;
	className?: string | undefined;
	hint: IPopoverHint;
	icon?: keyof typeof Icons | undefined;
	trigger?: PopoverV2TriggerType | undefined;
}
