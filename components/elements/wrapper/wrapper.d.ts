/// <reference types="react" />
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { IWrapperSchema } from "./types";
interface IWrapperProps {
    id?: string | undefined;
    schema?: IWrapperSchema | undefined;
    /** only used internally by FrontendEngine */
    children?: Record<string, TFrontendEngineFieldSchema> | undefined;
}
export declare const Wrapper: (props: IWrapperProps) => JSX.Element;
export {};
