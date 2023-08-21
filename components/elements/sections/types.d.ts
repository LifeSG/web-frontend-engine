import { ISectionSchema } from "../section";
export interface ISectionsProps {
    schema?: Record<string, ISectionSchema> | undefined;
    warnings?: Record<string, string> | undefined;
}
