import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { TFormYupConfig } from "./types";
interface IYupContext {
    formValidationConfig: TFormYupConfig;
    setFormValidationConfig: Dispatch<SetStateAction<TFormYupConfig>>;
}
interface IProps {
    children: ReactElement;
}
export declare const YupContext: React.Context<IYupContext>;
export declare const YupProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
