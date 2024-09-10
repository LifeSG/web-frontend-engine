import { Dispatch, ReactElement, SetStateAction } from "react";
import { TCustomComponentProps } from "../../components";
export type TCustomComponent<S> = (props: TCustomComponentProps<S>) => JSX.Element;
export type TCustomComponents = Record<string, TCustomComponent<any>>;
interface ICustomComponentsContext {
    customComponents: TCustomComponents;
    setCustomComponents: Dispatch<SetStateAction<TCustomComponents>>;
}
interface IProps {
    children: ReactElement;
}
export declare const CustomComponentsContext: import("react").Context<ICustomComponentsContext>;
export declare const CustomComponentsProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
