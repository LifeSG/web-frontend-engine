interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    $resizable?: boolean | undefined;
}
export declare const Wrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$chipPosition"> & {
    $chipPosition?: "top" | "bottom" | undefined;
}, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$chipPosition"> & {
    $chipPosition?: "top" | "bottom" | undefined;
}, never>>> & string;
export declare const ChipContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$chipPosition"> & {
    $chipPosition?: "top" | "bottom" | undefined;
}, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$chipPosition"> & {
    $chipPosition?: "top" | "bottom" | undefined;
}, never>>> & string;
export declare const StyledTextarea: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>, "ref"> & {
    ref?: import("react").Ref<HTMLTextAreaElement>;
}, keyof ITextareaProps> & ITextareaProps, never> & Partial<Pick<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>, "ref"> & {
    ref?: import("react").Ref<HTMLTextAreaElement>;
}, keyof ITextareaProps> & ITextareaProps, never>>> & string & Omit<(props: import("@lifesg/react-design-system/form/types").FormTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>) => React.ReactElement | null, keyof import("react").Component<any, {}, any>>;
export {};
