import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
import { ToggleProps } from "@lifesg/react-design-system/toggle";
type TCustomOptions = {
    border?: boolean | undefined;
};
export interface ISwitchSchema<V = undefined> extends IBaseFieldSchema<"switch", V>, TComponentOmitProps<ToggleProps> {
    customOptions?: TCustomOptions | undefined;
}
export {};
