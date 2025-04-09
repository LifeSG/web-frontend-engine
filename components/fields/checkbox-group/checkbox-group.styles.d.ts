/// <reference types="react" />
import { TCheckboxToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TCheckboxToggleLayoutType;
}
export declare const Label: import("styled-components").StyledComponent<"p", any, import("@lifesg/react-design-system/v2_text").V2_TextProps & ILabelProps, never>;
export declare const StyledCheckbox: import("styled-components").StyledComponent<({ className, checked, disabled, indeterminate, onChange, onKeyPress, displaySize, ...otherProps }: import("@lifesg/react-design-system/checkbox").CheckboxProps) => JSX.Element, any, {}, never>;
export declare const CheckboxContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const ToggleWrapper: import("styled-components").StyledComponent<"div", any, IToggleWrapperProps, never>;
export declare const StyledToggle: import("styled-components").StyledComponent<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, onRemove, "data-testid": testId, onChange, useContentWidth, }: import("@lifesg/react-design-system/toggle").ToggleProps) => import("react/jsx-runtime").JSX.Element, any, {}, never>;
export {};
