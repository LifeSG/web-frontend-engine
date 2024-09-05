import * as Icons from "@lifesg/react-icons";
import { IYupValidationRule, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { IBaseCustomFieldSchema } from "../types";

export interface IArrayFieldValidationRule extends IYupValidationRule {
	// TODO: unique rule
}

export interface IArrayFieldButton {
	label?: string | undefined;
	icon?: keyof typeof Icons | undefined;
}

export interface IArrayFieldSchema<V = undefined>
	extends IBaseCustomFieldSchema<"array-field", V, IArrayFieldValidationRule> {
	fieldSchema: Record<string, TFrontendEngineFieldSchema>;
	sectionTitle?: string | undefined;
	addButton?: IArrayFieldButton | undefined;
	removeButton?: IArrayFieldButton | undefined;
}
