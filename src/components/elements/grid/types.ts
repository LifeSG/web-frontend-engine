import { ContainerProps } from "@lifesg/react-design-system/layout";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseFieldSchema } from "../../fields/types";

export interface IGridSchema<V = undefined>
	extends Omit<IBaseFieldSchema<"grid", V>, "label">,
		TComponentOmitProps<ContainerProps, "children" | "type"> {
	children: Record<string, TFrontendEngineFieldSchema<V>>;
}
