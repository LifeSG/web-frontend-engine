import { TFieldEventListener } from "../../../utils";
import { IBaseCustomFieldSchema } from "../types";

export interface IIframeSchema
	extends Omit<IBaseCustomFieldSchema<"iframe">, "validation">,
		React.IframeHTMLAttributes<HTMLIFrameElement> {
	src: string;
	/** defaults to 2000, set -1 to skip validation */
	validationTimeout?: number | undefined;
	"data-testid"?: string | undefined;
}

export enum EPostMessageEvent {
	RESIZE = "frontendEngine.resize",
	/** initiate sync of field state from child to parent */
	TRIGGER_SYNC = "frontendEngine.triggerSync",
	/** passing of field state from parent to child */
	SYNC = "frontendEngine.sync",
	SET_VALUE = "frontendEngine.setValue",
	SUBMIT = "frontendEngine.submit",
	/** initiate validation from parent to child */
	VALIDATE = "frontendEngine.validate",
	/** validation response from child to parent */
	VALIDATION_RESULT = "frontendEngine.validationResult",
	/** load complete */
	LOADED = "frontendEngine.loaded",
}

// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired when button is clicked */
function iframeEvent(
	referenceKey: "iframe",
	type: "loading",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function iframeEvent(
	referenceKey: "iframe",
	type: "loaded",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function iframeEvent() {
	//
}
export type TIframeEvents = typeof iframeEvent;
