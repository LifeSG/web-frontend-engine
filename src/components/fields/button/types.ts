import { ButtonProps } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IBaseFieldSchema } from "../types";

export interface IButtonSchema extends Omit<IBaseFieldSchema<"button">, "validation">, ButtonProps {
	startIcon?: keyof typeof Icons;
	endIcon?: keyof typeof Icons;
}
