import { ButtonProps } from "@lifesg/react-design-system/button/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface ISubmitButtonSchema
	extends Omit<IBaseFieldSchema<"submit">, "validation">,
		TComponentOmitProps<ButtonProps, "disabled"> {
	disabled?: boolean | "invalid-form" | undefined;
	label: string;
}
