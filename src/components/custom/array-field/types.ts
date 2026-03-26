import { ButtonStyleType } from "@lifesg/react-design-system/button/types";
import * as Icons from "@lifesg/react-icons";
import { IYupValidationRule, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { IBaseCustomFieldSchema } from "../types";

export interface IArrayFieldUniqueItemRule {
	field: string;
	errorMessage?: string | undefined;
}

export interface IArrayFieldValidationRule extends IYupValidationRule {
	/** for customising error message when one section is invalid */
	valid?: boolean | undefined;
	/** Specify child fields that must be unique across all array items, with a custom error message per field. */
	unique?: IArrayFieldUniqueItemRule[] | undefined;
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
	fieldSchema: Record<string, TFrontendEngineFieldSchema<V, C>>;
	initialEntries?: number | undefined;
	sectionInset?: number | string | undefined;
	sectionTitle?: string | undefined;
	showDivider?: boolean | undefined;
	addButton?: IArrayFieldButton | undefined;
	removeButton?: IArrayFieldRemoveButton | undefined;
	removeConfirmationModal?: IArrayFieldRemoveConfirmationModal | undefined;
}
