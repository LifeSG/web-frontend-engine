import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { InputGroupAddonPosition } from "@lifesg/react-design-system/input-group";
import * as Icons from "@lifesg/react-icons";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
type TCustomOptions = {
    preventCopyAndPaste?: boolean | undefined;
    preventDragAndDrop?: boolean | undefined;
    addOn?: TIconAddOn | TLabelAddOn | undefined;
};
type TIconAddOn = {
    type: "icon";
    icon: keyof typeof Icons;
    color?: string | undefined;
    position?: InputGroupAddonPosition | undefined;
};
type TLabelAddOn = {
    type: "label";
    value: string;
    position?: InputGroupAddonPosition | undefined;
};
export type TCustomOptionsText = TCustomOptions & {
    textTransform?: "uppercase" | undefined;
};
export interface ITextFieldSchema<V = undefined> extends IBaseFieldSchema<"text-field", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
    customOptions?: TCustomOptionsText | undefined;
}
export interface IEmailFieldSchema<V = undefined> extends IBaseFieldSchema<"email-field", V>, TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
    customOptions?: TCustomOptions | undefined;
}
export interface INumericFieldSchema<V = undefined> extends IBaseFieldSchema<"numeric-field", V>, TComponentOmitProps<FormInputProps, "type" | "max" | "min"> {
    customOptions?: TCustomOptions | undefined;
}
export {};
