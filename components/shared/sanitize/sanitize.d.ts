/// <reference types="react" />
import { IOptions } from "sanitize-html";
interface IProps {
    children: string | React.ReactNode;
    className?: string | undefined;
    id?: string | undefined;
    sanitizeOptions?: IOptions;
}
export declare const Sanitize: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
