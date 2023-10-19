import { ILocationFieldSchema } from "./location-field";
import { ICheckboxGroupSchema } from "./checkbox-group";
import { IChipsSchema } from "./chips";
import { IContactFieldSchema } from "./contact-field";
import { IDateFieldSchema } from "./date-field";
import { TDateRangeFieldSchema } from "./date-range-field";
import { IImageUploadSchema } from "./image-upload";
import { IMultiSelectSchema } from "./multi-select";
import { IRadioButtonGroupSchema } from "./radio-button";
import { IRangeSelectSchema } from "./range-select";
import { IResetButtonSchema } from "./reset-button";
import { ISelectSchema } from "./select";
import { ISubmitButtonSchema } from "./submit-button";
import { ISwitchSchema } from "./switch";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./text-field";
import { ITextareaSchema } from "./textarea";
import { ITimeFieldSchema } from "./time-field";
import { IUnitNumberFieldSchema } from "./unit-number-field";
import { IYupValidationRule, TRenderRules } from "../frontend-engine/yup";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

/**
 * field types
 * - components that can contain values that can get submitted
 * - comes with validation config
 */
export enum EFieldType {
	CHECKBOX = "CheckboxGroup",
	CHIPS = "Chips",
	"CONTACT-FIELD" = "ContactField",
	"DATE-FIELD" = "DateField",
	"DATE-RANGE-FIELD" = "DateRangeField",
	"EMAIL-FIELD" = "TextField",
	"IMAGE-UPLOAD" = "ImageUpload",
	"LOCATION-FIELD" = "LocationField",
	"MULTI-SELECT" = "MultiSelect",
	"RANGE-SELECT" = "RangeSelect",
	"NUMERIC-FIELD" = "TextField",
	RADIO = "RadioButtonGroup",
	RESET = "ResetButton",
	SELECT = "Select",
	SUBMIT = "SubmitButton",
	SWITCH = "Switch",
	TEXTAREA = "Textarea",
	"TEXT-FIELD" = "TextField",
	"TIME-FIELD" = "TimeField",
	"UNIT-NUMBER-FIELD" = "UnitNumberField",
}

/**
 * union type to represent all field schemas
 */
export type TFieldSchema<V = undefined> =
	| ICheckboxGroupSchema<V>
	| IChipsSchema<V>
	| IContactFieldSchema<V>
	| IDateFieldSchema<V>
	| TDateRangeFieldSchema<V>
	| IEmailFieldSchema<V>
	| IImageUploadSchema<V>
	| ILocationFieldSchema<V>
	| IMultiSelectSchema<V>
	| IRangeSelectSchema
	| INumericFieldSchema<V>
	| IRadioButtonGroupSchema<V>
	| IResetButtonSchema
	| ISelectSchema<V>
	| ISubmitButtonSchema
	| ISwitchSchema<V>
	| ITextareaSchema<V>
	| ITextFieldSchema<V>
	| ITimeFieldSchema<V>
	| IUnitNumberFieldSchema<V>;

// NOTE: U generic is for internal use, prevents getting overwritten by custom validation types
export interface IBaseFieldSchema<T, V = undefined, U = undefined> {
	/** defines what kind of component to be rendered */
	uiType: T;
	/** caption for the field */
	label: string;
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	/** validation config, can be customised by passing generics */
	validation?: (V | U | IYupValidationRule)[];
	/** escape hatch for other form / frontend engines to have unsupported attributes */
	customOptions?: Record<string, unknown> | undefined;
}

// =============================================================================
// FIELD PROPS
// =============================================================================
/**
 * common props for all fields
 */
export interface IGenericFieldProps<T> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	id: string;
	schema: T;
}
