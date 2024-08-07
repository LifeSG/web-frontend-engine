import { TFrontendEngineFieldSchema } from "../../../frontend-engine";
import { ICustomElementJsonSchema } from "../../types";
import { TClearBehavior } from "../filter/types";
import { IFilterItemLabel } from "../types";

export interface IFilterItemSchema<V = undefined, C = undefined> extends ICustomElementJsonSchema<"filter-item"> {
	label: string | IFilterItemLabel;
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
	clearBehavior?: TClearBehavior | undefined;
	expanded?: boolean | undefined;
}
