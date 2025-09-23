/// <reference types="react" />
interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    resizable?: boolean | undefined;
}
export declare const Wrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    chipPosition?: "top" | "bottom" | undefined;
}>> & string;
export declare const ChipContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    $chipPosition?: "top" | "bottom" | undefined;
}>> & string;
export declare const StyledTextarea: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<Omit<import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>, "ref"> & {
    ref?: import("react").Ref<HTMLTextAreaElement>;
}, ITextareaProps>> & string & Omit<(props: import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export {};
