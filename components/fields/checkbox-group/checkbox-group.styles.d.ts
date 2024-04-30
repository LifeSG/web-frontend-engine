/// <reference types="react" />
import { TCheckboxToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TCheckboxToggleLayoutType;
}
export declare const Label: import("styled-components").StyledComponent<"p", any, import("@lifesg/react-design-system/text").TextProps & ILabelProps, never>;
export declare const StyledCheckbox: import("styled-components").StyledComponent<({ className, checked, disabled, indeterminate, onChange, onKeyPress, displaySize, ...otherProps }: import("@lifesg/react-design-system/checkbox").CheckboxProps) => JSX.Element, any, {}, never>;
export declare const CheckboxContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const ToggleWrapper: import("styled-components").StyledComponent<"div", any, IToggleWrapperProps, never>;
export declare const StyledToggle: import("styled-components").StyledComponent<({ type, indicator, checked, styleType, children, subLabel, disabled, error, name, id, className, "data-testid": testId, onChange, }: import("@lifesg/react-design-system/toggle").ToggleProps) => JSX.Element, any, {}, never>;
export declare const ToggleSublabel: import("styled-components").StyledComponent<"div", any, {}, never>;
export {};
