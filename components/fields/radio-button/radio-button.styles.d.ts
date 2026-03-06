/// <reference types="react" />
import { TRadioToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TRadioToggleLayoutType;
}
export declare const Label: import("styled-components").StyledComponent<"p", any, import("@lifesg/react-design-system/text").TextProps & ILabelProps, never>;
export declare const StyledRadioButton: import("styled-components").StyledComponent<({ className, checked, disabled, onChange, ...otherProps }: import("@lifesg/react-design-system/radio-button").RadioButtonProps) => import("react/jsx-runtime").JSX.Element, any, {}, never>;
export declare const StyledImageButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/image-button").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, {}, never>;
export declare const RadioContainer: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const FlexImageWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const FlexToggleWrapper: import("styled-components").StyledComponent<"div", any, IToggleWrapperProps, never>;
export declare const StyledToggle: import("styled-components").StyledComponent<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, onRemove, "data-testid": testId, onChange, useContentWidth, }: import("@lifesg/react-design-system/toggle").ToggleProps) => import("react/jsx-runtime").JSX.Element, any, {}, never>;
export {};
