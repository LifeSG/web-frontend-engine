import { ButtonProps } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IBaseFieldSchema } from "../types";
import { TFieldEventListener } from "../../../utils";
export interface IButtonSchema extends Omit<IBaseFieldSchema<"button">, "validation">, Omit<ButtonProps, "loading" | "type"> {
    startIcon?: keyof typeof Icons | undefined;
    endIcon?: keyof typeof Icons | undefined;
    "data-testid"?: string | undefined;
    label: string;
}
/** fired when button is clicked */
declare function buttonEvent(uiType: "button", type: "click", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
export type TButtonEvents = typeof buttonEvent;
export {};
