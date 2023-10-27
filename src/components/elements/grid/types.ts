import { ContainerProps } from "@lifesg/react-design-system";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema, TFieldSchema } from "../../fields/types";

export interface IGridSchema<V = undefined>
	extends Omit<IBaseFieldSchema<"grid", V>, "label">,
		TComponentOmitProps<ContainerProps, "children" | "type"> {
	children: Record<string, TFieldSchema<V>>;
}
