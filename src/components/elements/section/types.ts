import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";

type TCustomOptions = {
	gridType?: "v2" | "v3" | undefined;
};

export interface ISectionSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"section">,
		TComponentOmitProps<TWrapperSchema> {
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	layoutType?: "default" | "grid" | "contain" | undefined;
	customOptions?: TCustomOptions | undefined;
}

export interface ISectionProps {
	id: string;
	sectionSchema: ISectionSchema;
}
