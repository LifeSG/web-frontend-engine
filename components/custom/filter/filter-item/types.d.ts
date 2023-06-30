import { ICustomComponentJsonSchema, TFrontendEngineFieldSchema } from "../../../frontend-engine";
export interface IFilterItemSchema<V = undefined> extends ICustomComponentJsonSchema<"filter-item"> {
    label: string;
    children: Record<string, TFrontendEngineFieldSchema<V>>;
    collapsible?: boolean | undefined;
    showDivider?: boolean | undefined;
    showMobileDivider?: boolean | undefined;
}
