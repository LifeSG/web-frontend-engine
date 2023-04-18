import { UnitNumberInputProps } from "@lifesg/react-design-system/unit-number";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine";

export interface IUnitNumberFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"unit-number-field", V>,
		TComponentOmitProps<UnitNumberInputProps> {}
