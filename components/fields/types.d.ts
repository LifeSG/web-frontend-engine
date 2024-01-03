import { FormLabelProps } from "@lifesg/react-design-system/form/types";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { IColumns } from "../frontend-engine";
import { IYupValidationRule, TRenderRules } from "../frontend-engine/yup";
import { IButtonSchema } from "./button";
import { ICheckboxGroupSchema } from "./checkbox-group";
import { IChipsSchema } from "./chips";
import { IContactFieldSchema } from "./contact-field";
import { IDateFieldSchema } from "./date-field";
import { TDateRangeFieldSchema } from "./date-range-field";
import { IImageUploadSchema } from "./image-upload";
import { ILocationFieldSchema } from "./location-field";
import { IMultiSelectSchema } from "./multi-select";
import { INestedMultiSelectSchema } from "./nested-multi-select";
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
/**
 * field types
 * - components that can contain values that can get submitted
 * - comes with validation config
 */
export declare enum EFieldType {
    BUTTON = "ButtonField",
    CHECKBOX = "CheckboxGroup",
    CHIPS = "Chips",
    "CONTACT-FIELD" = "ContactField",
    "DATE-FIELD" = "DateField",
    "DATE-RANGE-FIELD" = "DateRangeField",
    "EMAIL-FIELD" = "TextField",
    "IMAGE-UPLOAD" = "ImageUpload",
    "LOCATION-FIELD" = "LocationField",
    "MULTI-SELECT" = "MultiSelect",
    "NESTED-MULTI-SELECT" = "NestedMultiSelect",
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
    "UNIT-NUMBER-FIELD" = "UnitNumberField"
}
/**
 * union type to represent all field schemas
 */
export type TFieldSchema<V = undefined> = IButtonSchema | ICheckboxGroupSchema<V> | IChipsSchema<V> | IContactFieldSchema<V> | IDateFieldSchema<V> | TDateRangeFieldSchema<V> | IEmailFieldSchema<V> | IImageUploadSchema<V> | ILocationFieldSchema<V> | IMultiSelectSchema<V> | IRangeSelectSchema | INestedMultiSelectSchema<V> | INumericFieldSchema<V> | IRadioButtonGroupSchema<V> | IResetButtonSchema | ISelectSchema<V> | ISubmitButtonSchema | ISwitchSchema<V> | ITextareaSchema<V> | ITextFieldSchema<V> | ITimeFieldSchema<V> | IUnitNumberFieldSchema<V>;
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
    validation?: (V | U | IYupValidationRule)[];
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
/**
 * common props for all fields
 */
export interface IGenericFieldProps<T> extends Partial<ControllerFieldState>, Partial<ControllerRenderProps> {
    id: string;
    formattedLabel?: string | FormLabelProps | undefined;
    schema: T;
}
export {};
