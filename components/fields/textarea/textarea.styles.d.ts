/// <reference types="react" />
interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxLength?: number | undefined;
    resizable?: boolean | undefined;
}
export declare const Wrapper: import("styled-components").StyledComponent<"div", any, {
    chipPosition?: "top" | "bottom" | undefined;
}, never>;
export declare const ChipContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const StyledTextarea: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, ITextareaProps, never>;
export {};
