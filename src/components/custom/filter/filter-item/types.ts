import { ICustomComponentJsonSchema, TFrontendEngineFieldSchema } from "../../../frontend-engine";

export interface IFilterItemSchema extends ICustomComponentJsonSchema {
	label: string;
	children: Record<string, TFrontendEngineFieldSchema>;
	collapsible?: boolean;
	showDivider?: boolean;
	showMobileDivider?: boolean;
}

export interface IFilterItemProps {
	id?: string | undefined;
	schema?: IFilterItemSchema;
	warnings?: Record<string, string> | undefined;
}
