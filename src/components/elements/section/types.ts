import {
	IFrontendEngineElementJsonSchema,
	TComponentOmitProps,
	TFrontendEngineFieldSchema,
} from "../../frontend-engine";
import { IWrapperSchema } from "../wrapper";

export interface ISectionSchema<V = undefined>
	extends IFrontendEngineElementJsonSchema<"section">,
		TComponentOmitProps<IWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema<V>>;
}

export interface ISectionProps {
	id: string;
	schema: ISectionSchema;
	warnings?: Record<string, string> | undefined;
}
