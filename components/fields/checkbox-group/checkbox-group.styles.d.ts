/// <reference types="react" />
import { TCheckboxToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TCheckboxToggleLayoutType;
}
export declare const Label: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("@lifesg/react-design-system/typography").TypographyProps & {
    ref?: import("react").RefObject<HTMLParagraphElement>;
}, ILabelProps>> & string;
export declare const StyledCheckbox: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/checkbox").CheckboxProps, never>> & string & Omit<({ className, checked, disabled, indeterminate, displaySize, id, ...otherProps }: import("@lifesg/react-design-system/checkbox").CheckboxProps) => JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const CheckboxContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const ToggleWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, IToggleWrapperProps>> & string;
export declare const StyledToggle: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/toggle").ToggleProps, never>> & string & Omit<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, onRemove, "data-testid": testId, onChange, useContentWidth, "aria-describedby": ariaDescribedBy, ...otherProps }: import("@lifesg/react-design-system/toggle").ToggleProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export {};
