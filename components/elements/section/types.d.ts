import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { TWrapperSchema } from "../wrapper";
export interface ISectionSchema<V = undefined, C = undefined> extends IBaseElementSchema<"section">, TComponentOmitProps<TWrapperSchema> {
    children: Record<string, TFrontendEngineFieldSchema<V, C>>;
    layoutType?: "default" | "grid" | "contain" | undefined;
}
export interface ISectionProps {
    id: string;
    sectionSchema: ISectionSchema;
}
