import { UnitNumberInputProps } from "@lifesg/react-design-system/unit-number";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";
export interface IUnitNumberFieldValidationRule {
    unitNumberFormat?: boolean | undefined;
}
export interface IUnitNumberFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"unit-number-field", V, IUnitNumberFieldValidationRule>, TComponentOmitProps<UnitNumberInputProps> {
}
