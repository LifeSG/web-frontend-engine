import { ButtonProps } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import { IBaseFieldSchema } from "../types";
import { TFieldEventListener } from "../../../utils";

// =============================================================================
// TYPES
// =============================================================================
export type TLinkTarget = "_blank" | "_self" | "_parent" | "_top";

export interface IButtonSchema
	extends Omit<IBaseFieldSchema<"button">, "validation">,
		Omit<ButtonProps, "loading" | "type" | "icon"> {
	icon?: keyof typeof Icons | undefined;
	label: string;
	href?: string | undefined;
	target?: TLinkTarget | undefined;
}

// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired when button is clicked */
function buttonEvent(
	uiType: "button",
	type: "click",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function buttonEvent() {
	//
}
export type TButtonEvents = typeof buttonEvent;
