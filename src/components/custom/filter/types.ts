import { ICustomComponentJsonSchema } from "../../frontend-engine";
import { IFilterItemSchema } from "./filter-item/types";
export type Mode = "default" | "mobile";

export interface IFilterSchema extends ICustomComponentJsonSchema {
	label?: string;
	toggleFilterButtonLabel?: string;
	children: Record<string, IFilterItemSchema>;
}

export interface IFilterProps {
	id?: string | undefined;
	schema?: IFilterSchema;
	warnings?: Record<string, string> | undefined;
}
