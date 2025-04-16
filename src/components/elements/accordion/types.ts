import { BoxContainerDisplayState, BoxContainerSubComponentTestIds } from "@lifesg/react-design-system/box-container";
import { TFieldEventListener } from "../../../utils";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IPopoverSchema } from "../popover/types";
import { ITextSchema } from "../text/types";
import { IBaseElementSchema } from "../types";
import { TInlineWrapperSchema, TWrapperSchema } from "../wrapper";

export interface IButtonAccordion {
	label: string | undefined;
}

export interface IAccordionSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"accordion">,
		TComponentOmitProps<TWrapperSchema, "customOptions" | "title"> {
	uiType: "accordion";
	button?: boolean | IButtonAccordion | undefined;
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	className?: string | undefined;
	"data-testid"?: string | undefined;
	subComponentTestIds?: BoxContainerSubComponentTestIds | undefined;
	collapsible?: boolean | undefined;
	expanded?: boolean | undefined;
	displayState?: BoxContainerDisplayState | undefined;
	title: string | Record<string, ITextSchema | IPopoverSchema | TInlineWrapperSchema<V, C>>;
	disableContentInset?: boolean | undefined;
}

// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired on clicking edit button */
function accordionEvent(
	uiType: "accordion",
	type: "edit",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function accordionEvent() {
	//
}
export type TAccordionEvents = typeof accordionEvent;
