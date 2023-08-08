import { RadioButtonProps } from "@lifesg/react-design-system/radio-button";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
interface IOption {
    label: string;
    value: string;
    disabled?: boolean | undefined;
    imgSrc?: string | undefined;
}
type TCustomOptions = {
    styleType: "default";
} | {
    styleType: "toggle";
    indicator?: boolean | undefined;
    border?: boolean | undefined;
} | {
    styleType: "image-button";
};
export interface IRadioButtonGroupSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"radio", V>, TComponentOmitProps<RadioButtonProps> {
    options: IOption[];
    customOptions?: TCustomOptions;
}
export {};
