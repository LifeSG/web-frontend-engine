/// <reference types="react" />
interface ILabelProps {
    disabled?: boolean | undefined;
}
export declare const Label: import("styled-components").StyledComponent<"p", any, import("@lifesg/react-design-system").TextProps & ILabelProps, never>;
export declare const StyledRadioButton: import("styled-components").StyledComponent<({ className, checked, disabled, onChange, ...otherProps }: import("@lifesg/react-design-system").RadioButtonProps) => JSX.Element, any, {}, never>;
export declare const StyledImageButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, {}, never>;
export declare const RadioContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const FlexWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export {};
