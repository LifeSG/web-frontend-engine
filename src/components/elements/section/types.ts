import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface ISectionSchema<V = undefined>
	extends IBaseElementSchema<"section">,
		TComponentOmitProps<IWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema<V>>;
}

export interface ISectionProps {
	id: string;
	sectionSchema: ISectionSchema;
	warnings?: Record<string, string> | undefined;
}
