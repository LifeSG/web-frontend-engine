/// <reference types="react" />
interface InputWrapperStyleProps {
    disabled?: boolean | undefined;
    $error?: boolean | undefined;
    $readOnly?: boolean | undefined;
    $focused?: boolean | undefined;
}
export declare const DummyLocationInput: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, keyof InputWrapperStyleProps> & InputWrapperStyleProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, keyof InputWrapperStyleProps> & InputWrapperStyleProps, never>>> & string;
export declare const LocationInputText: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "$placeholder" | "$disabled"> & {
    $placeholder?: boolean;
    $disabled?: boolean;
}, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "$placeholder" | "$disabled"> & {
    $placeholder?: boolean;
    $disabled?: boolean;
}, never>>> & string;
export declare const LocationIconWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$readOnly" | "$disabled"> & {
    $disabled?: boolean;
    $readOnly?: boolean;
}, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$readOnly" | "$disabled"> & {
    $disabled?: boolean;
    $readOnly?: boolean;
}, never>>> & string;
export {};
