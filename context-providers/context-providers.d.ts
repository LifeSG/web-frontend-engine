import { ReactElement } from "react";
interface IProps {
    children: ReactElement;
    recaptchaSiteKey?: string | undefined;
}
export declare const ContextProviders: ({ children, recaptchaSiteKey }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
