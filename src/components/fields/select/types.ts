import { InputSelectProps } from "@lifesg/react-design-system";
import { BaseFormElementProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";

export interface ISelectRef extends BaseFormElementProps, InputSelectProps<string, string> {}

export interface ISelectSchema
	extends IFrontendEngineBaseFieldJsonSchema,
		Pick<InputSelectProps<unknown, unknown>, "disabled" | "placeholder" | "options" | "listStyleWidth"> {
	type: "SELECT";
}
