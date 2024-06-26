import { FormLabelProps } from "@lifesg/react-design-system/form/types";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { IColumns } from "../frontend-engine";
import { IYupValidationRule, TRenderRules } from "../../context-providers";
import { IButtonSchema } from "./button";
import { TCheckboxGroupSchema } from "./checkbox-group";
import { IChipsSchema } from "./chips";
import { IContactFieldSchema } from "./contact-field";
import { IDateFieldSchema } from "./date-field";
import { TDateRangeFieldSchema } from "./date-range-field";
import { IFileUploadSchema } from "./file-upload";
import { IHistogramSliderSchema } from "./histogram-slider";
import { IImageUploadSchema } from "./image-upload";
import { ILocationFieldSchema } from "./location-field";
import { IMaskedFieldSchema } from "./masked-field";
import { IMultiSelectSchema } from "./multi-select";
import { INestedMultiSelectSchema } from "./nested-multi-select";
import { TRadioButtonGroupSchema } from "./radio-button";
import { IRangeSelectSchema } from "./range-select";
import { IResetButtonSchema } from "./reset-button";
import { ISelectSchema } from "./select";
import { ISliderSchema } from "./slider";
import { ISubmitButtonSchema } from "./submit-button";
import { ISwitchSchema } from "./switch";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./text-field";
import { ITextareaSchema } from "./textarea";
import { ITimeFieldSchema } from "./time-field";
import { IUnitNumberFieldSchema } from "./unit-number-field";
import { IHiddenFieldSchema } from "./hidden-field/types";

/**
 * field types
 * - components that can contain values that can get submitted
 * - comes with validation config
 */
export enum EFieldType {
	BUTTON = "ButtonField",
	CHECKBOX = "CheckboxGroup",
	CHIPS = "Chips",
	"CONTACT-FIELD" = "ContactField",
	"DATE-FIELD" = "DateField",
	"DATE-RANGE-FIELD" = "DateRangeField",
	"EMAIL-FIELD" = "TextField",
	"FILE-UPLOAD" = "FileUpload",
	"HIDDEN-FIELD" = "HiddenField",
	"HISTOGRAM-SLIDER" = "HistogramSlider",
	"IMAGE-UPLOAD" = "ImageUpload",
	"LOCATION-FIELD" = "LocationField",
	"MASKED-FIELD" = "MaskedField",
	"MULTI-SELECT" = "MultiSelect",
	"NESTED-MULTI-SELECT" = "NestedMultiSelect",
	"RANGE-SELECT" = "RangeSelect",
	"NUMERIC-FIELD" = "TextField",
	RADIO = "RadioButtonGroup",
	RESET = "ResetButton",
	SELECT = "Select",
	SLIDER = "Slider",
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
	| IButtonSchema
	| IChipsSchema<V>
	| IContactFieldSchema<V>
	| IDateFieldSchema<V>
	| IEmailFieldSchema<V>
	| IFileUploadSchema<V>
	| IHiddenFieldSchema<V>
	| IHistogramSliderSchema<V>
	| IImageUploadSchema<V>
	| ILocationFieldSchema<V>
	| IMaskedFieldSchema<V>
	| IMultiSelectSchema<V>
	| IRangeSelectSchema
	| INestedMultiSelectSchema<V>
	| INumericFieldSchema<V>
	| IResetButtonSchema
	| ISelectSchema<V>
	| ISliderSchema<V>
	| ISubmitButtonSchema
	| ISwitchSchema<V>
	| ITextareaSchema<V>
	| ITextFieldSchema<V>
	| ITimeFieldSchema<V>
	| IUnitNumberFieldSchema<V>
	| TCheckboxGroupSchema<V>
	| TDateRangeFieldSchema<V>
	| TRadioButtonGroupSchema<V>;

// NOTE: U generic is for internal use, prevents getting overwritten by custom validation types
export interface IBaseFieldSchema<T, V = undefined, U = undefined> {
	/** defines what kind of component to be rendered */
	uiType: T;
	/** caption for the field */
	label: string | IComplexLabel;
	/** render conditions
	 * - need to fulfil at least 1 object in array (OR condition)
	 * - in order for an object to be valid, need to fulfil all conditions in that object (AND condition) */
	showIf?: TRenderRules[] | undefined;
	/** validation config, can be customised by passing generics */
	validation?: (V | U | IYupValidationRule<V, U>)[];
	/** escape hatch for other form / frontend engines to have unsupported attributes */
	customOptions?: Record<string, unknown> | undefined;
	/** set responsive columns */
	columns?: IColumns | undefined;
}

/**
 * for displaying sub label and popover
 */
export interface IComplexLabel {
	mainLabel: string;
	subLabel?: string | undefined;
	hint?: IComplexLabelHint | undefined;
}

interface IComplexLabelHint {
	content: string;
}
// =============================================================================
// FIELD PROPS
// =============================================================================
/**
 * common props for all fields
 */
export interface IGenericFieldProps<T> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
	id: string;
	formattedLabel?: string | FormLabelProps | undefined;
	schema: T;
	warning?: string | undefined;
}
