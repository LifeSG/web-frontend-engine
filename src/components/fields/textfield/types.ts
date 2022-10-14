import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { IValidationRule } from "../../frontend-engine/validation-schema/types";

export interface ITextfieldSchema extends IFrontendEngineBaseFieldJsonSchema, FormInputProps {
	id: string;
	type: "TEXT" | "NUMBER" | "EMAIL";
	title: string;
	validation: IValidationRule[];
}
