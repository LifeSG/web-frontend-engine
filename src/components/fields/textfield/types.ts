import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";
import { IValidationRule } from "../../frontend-engine/validation-schema/types";

export interface ITextfieldSchema
	extends IFrontendEngineBaseFieldJsonSchema<"TEXT" | "NUMBER" | "EMAIL">,
		Omit<FormInputProps, TFrontendEngineBaseFieldJsonSchemaKeys> {
	id: string;
	title: string;
	validation: IValidationRule[];
}
