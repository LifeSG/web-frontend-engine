/// <reference types="react" />
interface ILabelProps {
    disabled?: boolean | undefined;
}
export declare const Label: import("styled-components").StyledComponent<"p", any, import("@lifesg/react-design-system/text").TextProps & ILabelProps, never>;
export declare const StyledCheckbox: import("styled-components").StyledComponent<({ className, checked, disabled, indeterminate, onChange, onKeyPress, displaySize, ...otherProps }: import("@lifesg/react-design-system/checkbox").CheckboxProps) => JSX.Element, any, {}, never>;
export declare const CheckboxContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const ToggleWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export {};
