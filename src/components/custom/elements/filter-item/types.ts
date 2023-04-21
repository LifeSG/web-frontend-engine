import { ICustomComponentJsonSchema, TFrontendEngineFieldSchema } from "../../../frontend-engine";

export interface IFilterItemSchema<V = undefined> extends ICustomComponentJsonSchema<"filter-item", V> {
	label: string;
	children: Record<string, TFrontendEngineFieldSchema>;
	collapsible?: boolean | undefined;
	showDivider?: boolean | undefined;
	showMobileDivider?: boolean | undefined;
}

export interface IFilterItemProps {
	id?: string | undefined;
	schema?: IFilterItemSchema | undefined;
	warnings?: Record<string, string> | undefined;
}
