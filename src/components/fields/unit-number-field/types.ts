import { UnitNumberInputProps } from "@lifesg/react-design-system/unit-number";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

export interface IUnitNumberFieldValidationRule {
	unitNumberFormat?: boolean | undefined;
}
export interface IUnitNumberFieldSchema<V = undefined>
	extends IBaseFieldSchema<"unit-number-field", V, IUnitNumberFieldValidationRule>,
		TComponentOmitProps<UnitNumberInputProps> {}
