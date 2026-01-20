import { ButtonStyleType } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IYupValidationRule, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { IBaseCustomFieldSchema } from "../types";

export interface IArrayFieldValidationRule extends IYupValidationRule {
	/** for customising error message when one section is invalid */
	valid?: boolean | undefined;
}

export interface IArrayFieldButton {
	label?: string | undefined;
	icon?: keyof typeof Icons | undefined;
	styleType?: ButtonStyleType | undefined;
}

export interface IArrayFieldRemoveButton extends IArrayFieldButton {
	position?: "top" | "bottom" | undefined;
	alignment?: "left" | "right" | undefined;
}

export type IArrayFieldRemoveConfirmationModal =
	| { skip: true }
	| { skip?: false | undefined; title?: string | undefined };

export interface IArrayFieldSchema<V = undefined, C = undefined>
	extends IBaseCustomFieldSchema<"array-field", V, IArrayFieldValidationRule> {
	// TODO: introduce unique rule for children of fieldSchema
	fieldSchema: Record<string, TFrontendEngineFieldSchema<V, C>>;
	sectionInset?: number | string | undefined;
	sectionTitle?: string | undefined;
	showDivider?: boolean | undefined;
	addButton?: IArrayFieldButton | undefined;
	removeButton?: IArrayFieldRemoveButton | undefined;
	removeConfirmationModal?: IArrayFieldRemoveConfirmationModal | undefined;
}
