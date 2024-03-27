import { Dispatch, ReactElement, SetStateAction } from "react";
import { TFormYupConfig } from "./types";
import { TWarningPayload } from "../../components/frontend-engine";
interface IYupContext {
    formValidationConfig: TFormYupConfig;
    setFormValidationConfig: Dispatch<SetStateAction<TFormYupConfig>>;
    warnings: TWarningPayload;
    setWarnings: Dispatch<SetStateAction<TWarningPayload>>;
}
interface IProps {
    children: ReactElement;
}
export declare const YupContext: import("react").Context<IYupContext>;
export declare const YupProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
