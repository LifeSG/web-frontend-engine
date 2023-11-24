import { TFrontendEngineFieldSchema } from "../../../frontend-engine";
import { ICustomElementJsonSchema } from "../../types";
import { TClearBehavior } from "../filter/types";

export interface IFilterItemSchema<V = undefined> extends ICustomElementJsonSchema<"filter-item"> {
	label: string;
	children: Record<string, TFrontendEngineFieldSchema<V>>;
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
	clearBehavior?: TClearBehavior | undefined;
	initialExpanded?: boolean | undefined;
}
