import { Dispatch, ReactElement, SetStateAction } from "react";
import { IFrontendEngineData } from "../types";
interface IFormSchemaContext {
    formSchema: IFrontendEngineData;
    setFormSchema: Dispatch<SetStateAction<IFrontendEngineData>>;
}
interface IProps {
    children: ReactElement;
}
export declare const FormSchemaContext: import("react").Context<IFormSchemaContext>;
export declare const FormSchemaProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
