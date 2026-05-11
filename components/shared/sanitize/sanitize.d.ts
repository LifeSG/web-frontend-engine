/// <reference types="react" />
import { MarkupProps } from "@lifesg/react-design-system/markup";
import { IOptions } from "sanitize-html";
interface IProps {
    baseTextColor?: MarkupProps["baseTextColor"] | undefined;
    baseTextSize?: MarkupProps["baseTextSize"] | undefined;
    children: string | React.ReactNode;
    className?: string | undefined;
    id?: string | undefined;
    inline?: boolean | undefined;
    sanitizeOptions?: IOptions;
}
export declare const Sanitize: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
