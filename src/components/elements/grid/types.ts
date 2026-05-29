import { ContainerProps } from "@lifesg/react-design-system/layout";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";

export interface IGridSchema<V = undefined, C = undefined>
	extends Omit<IBaseElementSchema<"grid">, "label">,
		TComponentOmitProps<ContainerProps, "children" | "stretch" | "type"> {
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
}
