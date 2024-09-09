import * as Icons from "@lifesg/react-icons";
import { IYupValidationRule, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { IBaseCustomFieldSchema } from "../types";

export interface IArrayFieldValidationRule extends IYupValidationRule {
	/** for customising error message when one section is invalid */
	valid?: boolean | undefined;
	// TODO: unique rule
}

export interface IArrayFieldButton {
	label?: string | undefined;
	icon?: keyof typeof Icons | undefined;
}

export interface IArrayFieldRemoveConfirmationModal {
	title?: string | undefined;
}

export interface IArrayFieldSchema<V = undefined>
	extends IBaseCustomFieldSchema<"array-field", V, IArrayFieldValidationRule> {
	fieldSchema: Record<string, TFrontendEngineFieldSchema>;
	sectionTitle?: string | undefined;
	showDivider?: boolean | undefined;
	addButton?: IArrayFieldButton | undefined;
	removeButton?: IArrayFieldButton | undefined;
	removeConfirmationModal?: IArrayFieldRemoveConfirmationModal | undefined;
}
