import { ButtonProps } from "@lifesg/react-design-system/button/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
export interface IResetButtonSchema extends Omit<IBaseFieldSchema<"reset">, "validation">, TComponentOmitProps<ButtonProps, "disabled"> {
    disabled?: boolean | undefined;
    ignoreDefaultValues?: boolean | undefined;
}
