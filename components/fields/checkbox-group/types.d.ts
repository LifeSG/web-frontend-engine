import { CheckboxProps } from "@lifesg/react-design-system/checkbox";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IOption {
    label: string;
    value: string;
    disabled?: boolean | undefined;
}
export interface IToggleOption extends IOption {
    none?: boolean | undefined;
    children?: Record<string, TFrontendEngineFieldSchema> | undefined;
}
export type TCheckboxToggleLayoutType = "horizontal" | "vertical";
interface ICheckboxGroupDefaultSchema<V = undefined> extends IBaseFieldSchema<"checkbox", V>, TComponentOmitProps<CheckboxProps> {
    options: IOption[];
    customOptions?: {
        styleType: "default";
    } | undefined;
}
interface ICheckboxGroupToggleSchema<V = undefined> extends IBaseFieldSchema<"checkbox", V>, TComponentOmitProps<CheckboxProps> {
    options: IToggleOption[];
    customOptions: {
        styleType: "toggle";
        indicator?: boolean | undefined;
        border?: boolean | undefined;
        layoutType?: TCheckboxToggleLayoutType | undefined;
    };
}
export type TCheckboxGroupSchema<V = undefined> = ICheckboxGroupDefaultSchema<V> | ICheckboxGroupToggleSchema<V>;
/** @deprecated will be removed in a future release. Use `TCheckboxGroupSchema` instead */
export type ICheckboxGroupSchema<V = undefined> = ICheckboxGroupDefaultSchema<V> | ICheckboxGroupToggleSchema<V>;
export {};
