/// <reference types="react" />
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";
interface IProps {
    id: string;
    schema: TFrontendEngineFieldSchema;
    Field: React.ComponentType<any>;
    warning?: string | undefined;
}
export declare const FieldWrapper: ({ Field, id, schema, warning }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
