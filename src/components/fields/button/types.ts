import { ButtonProps } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IBaseFieldSchema } from "../types";
import { TFieldEventListener } from "../../../utils";

// =============================================================================
// TYPES
// =============================================================================
export type TLinkTarget = "_blank" | "_self" | "_parent" | "_top";

export interface IButtonSchema
	extends Omit<IBaseFieldSchema<"button">, "validation">,
		Omit<ButtonProps, "loading" | "type"> {
	startIcon?: keyof typeof Icons | undefined;
	endIcon?: keyof typeof Icons | undefined;
	"data-testid"?: string | undefined;
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
