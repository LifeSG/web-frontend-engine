import { ButtonProps } from "@lifesg/react-design-system/button";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	Pick<ButtonProps, "data-testid" | "styleType" | "sizeType" | "danger" | "loading" | "focusableWhenDisabled">;

export interface IResetButtonSchema
	extends Omit<IBaseFieldSchema<"reset">, "validation">,
		TComponentOmitProps<TButtonProps> {
	disabled?: boolean | undefined;
	ignoreDefaultValues?: boolean | undefined;
	label: string;
}
