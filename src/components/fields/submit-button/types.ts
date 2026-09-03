import { ButtonProps } from "@lifesg/react-design-system/button";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	Pick<ButtonProps, "data-testid" | "styleType" | "sizeType" | "danger" | "loading" | "focusableWhenDisabled">;

export interface ISubmitButtonSchema
	extends Omit<IBaseFieldSchema<"submit">, "validation">,
		TComponentOmitProps<TButtonProps, "disabled"> {
	disabled?: boolean | "invalid-form" | undefined;
	label: string;
}
