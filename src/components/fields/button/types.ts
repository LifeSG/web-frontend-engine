import { ButtonProps } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IBaseFieldSchema } from "../types";

export interface IButtonSchema
	extends Omit<IBaseFieldSchema<"button">, "validation">,
		Omit<ButtonProps, "loading" | "type"> {
	startIcon?: keyof typeof Icons | undefined;
	endIcon?: keyof typeof Icons | undefined;
	"data-testid"?: string | undefined;
	label: string;
}
