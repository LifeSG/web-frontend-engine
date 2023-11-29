import React from "react";
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
import { TRenderRules } from "../../frontend-engine/yup";
interface IProps {
    id: string;
    renderRules?: TRenderRules[] | undefined;
    children: React.ReactNode;
    schema: TFrontendEngineFieldSchema | IFilterItemSchema | IFilterCheckboxSchema;
}
/**
 * conditionally render children according to render rules provided
 * render conditions are based on Yup schema and the base schema is derived from corresponding validation config
 * automatically remove validation config on hide / unmount, for more complex fields, it still has to be done via the field itself
 */
export declare const ConditionalRenderer: ({ id, renderRules, children, schema }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
