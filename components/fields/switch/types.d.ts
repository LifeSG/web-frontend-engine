import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { ToggleProps } from "@lifesg/react-design-system/toggle";
type TCustomOptions = {
    border?: boolean | undefined;
};
export interface ISwitchSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"switch", V>, TComponentOmitProps<ToggleProps> {
    customOptions?: TCustomOptions | undefined;
}
export {};
