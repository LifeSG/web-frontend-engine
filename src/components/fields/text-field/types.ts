import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export enum ETextTransform {
	UPPERCASE = "uppercase",
}

type TCustomOptions = {
	preventCopyAndPaste?: boolean | undefined;
	preventDragAndDrop?: boolean | undefined;
	textTransform?: ETextTransform | undefined;
};

type TCustomOptionsText = TCustomOptions & {
	textTransform?: ETextTransform | undefined;
};

export interface ITextFieldSchema<V = undefined>
	extends IBaseFieldSchema<"text-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
	customOptions?: TCustomOptionsText | undefined;
}

export interface IEmailFieldSchema<V = undefined>
	extends IBaseFieldSchema<"email-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
	customOptions?: TCustomOptions | undefined;
}

export interface INumericFieldSchema<V = undefined>
	extends IBaseFieldSchema<"numeric-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "max" | "min"> {
	customOptions?: TCustomOptions | undefined;
}
