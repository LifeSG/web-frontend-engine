import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import type { IPopoverSchema, ITextSchema, ITypographySchema } from "../../elements";
import type { IInlineWrapperSchema } from "../../elements/wrapper";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IRadioButtonOption {
    label: string | Record<string, ITextSchema | ITypographySchema | IPopoverSchema | IInlineWrapperSchema>;
    value: string;
    disabled?: boolean | undefined;
}
export interface IRadioToggleOption<V = undefined, C = undefined> extends IRadioButtonOption {
    children?: Record<string, TFrontendEngineFieldSchema<V, C>> | undefined;
    subLabel?: string | undefined;
}
export interface IImageButtonOption extends IRadioButtonOption {
    imgSrc?: string | undefined;
}
export type TRadioToggleLayoutType = "horizontal" | "vertical";
export type TBreakpoint = "mobile" | "tablet" | "desktop";
export type TResponsiveValue<T> = T | {
    mobile?: T | undefined;
    tablet?: T | undefined;
    desktop?: T | undefined;
};
export type TLayoutColumns = TResponsiveValue<number>;
export type TMinItemWidth = TResponsiveValue<number>;
interface IRadioButtonDefaultSchema<V = undefined> extends IBaseFieldSchema<"radio", V>, TComponentOmitProps<RadioButtonProps> {
    options: IRadioButtonOption[];
    customOptions?: {
        styleType: "default";
    } | undefined;
}
export interface IRadioButtonToggleSchema<V = undefined, C = undefined> extends IBaseFieldSchema<"radio", V>, TComponentOmitProps<RadioButtonProps> {
    options: IRadioToggleOption<V, C>[];
    allowDeselection?: boolean | undefined;
    customOptions: {
        styleType: "toggle";
        indicator?: boolean | undefined;
        border?: boolean | undefined;
        layoutType?: TRadioToggleLayoutType | undefined;
        layoutColumns?: TLayoutColumns | undefined;
        minItemWidth?: TMinItemWidth | undefined;
        stretch?: boolean | undefined;
    };
}
interface IRadioButtonImageButtonSchema<V = undefined> extends IBaseFieldSchema<"radio", V>, TComponentOmitProps<RadioButtonProps> {
    options: IImageButtonOption[];
    customOptions: {
        styleType: "image-button";
    };
}
export type TRadioButtonGroupSchema<V = undefined, C = undefined> = IRadioButtonDefaultSchema<V> | IRadioButtonToggleSchema<V, C> | IRadioButtonImageButtonSchema<V>;
export {};
