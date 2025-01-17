import { ICustomElementJsonSchema } from "../types";

export interface IIframeSchema
	extends ICustomElementJsonSchema<"iframe">,
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
}
