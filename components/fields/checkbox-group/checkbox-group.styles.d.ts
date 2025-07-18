/// <reference types="react" />
import { TCheckboxToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TCheckboxToggleLayoutType;
}
export declare const Label: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps & ILabelProps, never>;
export declare const StyledCheckbox: import("styled-components").StyledComponent<({ className, checked, disabled, indeterminate, onChange, onKeyPress, displaySize, ...otherProps }: import("@lifesg/react-design-system/checkbox").CheckboxProps) => JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export declare const CheckboxContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const ToggleWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, IToggleWrapperProps, never>;
export declare const StyledToggle: import("styled-components").StyledComponent<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, onRemove, "data-testid": testId, onChange, useContentWidth, }: import("@lifesg/react-design-system/toggle").ToggleProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export {};
