import { TCheckboxToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TCheckboxToggleLayoutType;
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
export declare const StyledCheckbox: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").CheckboxProps, never> & Partial<Pick<import("@lifesg/react-design-system").CheckboxProps, never>>> & string & Omit<({ className, checked, disabled, focusableWhenDisabled, indeterminate, displaySize, id, tabIndex, onChange, ...otherProps }: import("@lifesg/react-design-system").CheckboxProps) => JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const CheckboxContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
export declare const ToggleWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$layoutType"> & IToggleWrapperProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$layoutType"> & IToggleWrapperProps, never>>> & string;
export declare const StyledToggle: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").ToggleProps, never> & Partial<Pick<import("@lifesg/react-design-system").ToggleProps, never>>> & string & Omit<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, focusableWhenDisabled, useContentWidth, onRemove, onChange, "data-testid": testId, "aria-describedby": ariaDescribedBy, ...otherProps }: import("@lifesg/react-design-system").ToggleProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export {};
