import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";
export interface ISectionSchema<V = undefined, C = undefined> extends IBaseElementSchema<"section">, TComponentOmitProps<IWrapperSchema> {
    children: Record<string, TFrontendEngineFieldSchema<V, C>>;
    layoutType?: "default" | "grid" | "contain" | undefined;
}
export interface ISectionProps {
    id: string;
    sectionSchema: ISectionSchema;
}
