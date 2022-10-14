import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { IValidationRule } from "../../frontend-engine/validation-schema/types";

export interface ITextfieldSchema extends IFrontendEngineBaseFieldJsonSchema {
	id: string;
	type: "TEXT" | "NUMBER" | "EMAIL";
	title: string;
	validation: IValidationRule[];
}
