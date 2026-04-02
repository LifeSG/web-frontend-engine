import { Dispatch, ReactElement, SetStateAction } from "react";
interface IFrontendEngineFormContext {
    submitHandler: () => void;
    setSubmitHandler: Dispatch<SetStateAction<() => void>>;
    wrapInForm: boolean;
    setWrapInForm: Dispatch<SetStateAction<boolean>>;
}
interface IProps {
    children: ReactElement;
}
export declare const FrontendEngineFormContext: import("react").Context<IFrontendEngineFormContext>;
export declare const FrontendEngineFormProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
