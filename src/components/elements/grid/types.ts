import { ContainerProps } from "@lifesg/react-design-system/layout";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";

export interface IGridSchema
	extends Omit<IBaseElementSchema<"grid">, "label">,
		TComponentOmitProps<ContainerProps, "children" | "stretch" | "type"> {
	children: Record<string, TFrontendEngineFieldSchema>;
}
