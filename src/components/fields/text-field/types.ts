import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

type TCustomOptions = {
	preventCopyAndPaste?: boolean | undefined;
	preventDragAndDrop?: boolean | undefined;
};

export interface ITextFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"text-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
	customOptions?: TCustomOptions;
}

export interface IEmailFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"email-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "maxLength"> {
	customOptions?: TCustomOptions;
}

export interface INumericFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"numeric-field", V>,
		TComponentOmitProps<FormInputProps, "type" | "max" | "min"> {
	customOptions?: TCustomOptions;
}
