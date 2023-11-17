/// <reference types="react" />
import { IOptions } from "sanitize-html";
interface IProps {
    id?: string;
    children: string | React.ReactNode;
    sanitizeOptions?: IOptions;
}
export declare const Sanitize: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
