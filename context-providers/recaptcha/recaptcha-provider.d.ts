/// <reference types="react" />
import { IRecaptchaContext, IRecaptchaState, TRecaptchaActions } from "./types";
export declare const RecaptchaContext: import("react").Context<IRecaptchaContext>;
export declare const recaptchaStateReducer: (state: IRecaptchaState, action: TRecaptchaActions) => IRecaptchaState;
interface IRecaptchaProviderProps {
    children: React.ReactNode;
    /** reCAPTCHA v3 Enterprise site key. When omitted the provider is a no-op. */
    recaptchaSiteKey?: string | undefined;
}
export declare const RecaptchaProvider: ({ children, recaptchaSiteKey }: IRecaptchaProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
