import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
import { ToggleProps } from "@lifesg/react-design-system";

type TCustomOptions = {
	border?: boolean | undefined;
};

export interface ISwitchSchema<V = boolean>
	extends IFrontendEngineBaseFieldJsonSchema<"switch", V>,
		TComponentOmitProps<ToggleProps> {
	customOptions?: TCustomOptions;
}
