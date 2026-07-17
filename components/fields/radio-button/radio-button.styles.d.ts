import { TRadioToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TRadioToggleLayoutType;
    $resolvedColumns?: number | undefined;
    $resolvedMinItemWidth?: number | undefined;
    $stretch?: boolean | undefined;
    $hasMinItemWidth?: boolean | undefined;
}
export declare const Label: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLParagraphElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, "disabled"> & ILabelProps, never> & Partial<Pick<import("styled-components").FastOmit<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLParagraphElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, "disabled"> & ILabelProps, never>>> & string;
export declare const StyledRadioButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").RadioButtonProps, never> & Partial<Pick<import("@lifesg/react-design-system").RadioButtonProps, never>>> & string & Omit<({ className, checked, disabled, displaySize, focusableWhenDisabled, onChange, tabIndex, ...otherProps }: import("@lifesg/react-design-system").RadioButtonProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const StyledImageButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, never> & Partial<Pick<Omit<import("@lifesg/react-design-system").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, never>>> & string & Omit<(props: import("@lifesg/react-design-system").ImageButtonProps & React.RefAttributes<HTMLButtonElement>) => React.ReactElement | null, keyof import("react").Component<any, {}, any>>;
export declare const RadioContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
export declare const FlexImageWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
export declare const FlexToggleWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof IToggleWrapperProps> & IToggleWrapperProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof IToggleWrapperProps> & IToggleWrapperProps, never>>> & string;
export declare const StyledToggle: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").ToggleProps, never> & Partial<Pick<import("@lifesg/react-design-system").ToggleProps, never>>> & string & Omit<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, focusableWhenDisabled, useContentWidth, onRemove, onChange, "data-testid": testId, "aria-describedby": ariaDescribedBy, ...otherProps }: import("@lifesg/react-design-system").ToggleProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export {};
