import React from "react";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
interface IProps {
    id: string;
    children: React.ReactNode;
    childSchema: TFrontendEngineFieldSchema;
}
/**
 * render as col when using grid layout
 */
export declare const ColWrapper: ({ id, children, childSchema }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
