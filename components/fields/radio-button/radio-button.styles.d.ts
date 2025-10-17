/// <reference types="react" />
import { TRadioToggleLayoutType } from "./types";
interface ILabelProps {
    disabled?: boolean | undefined;
}
interface IToggleWrapperProps {
    $layoutType?: TRadioToggleLayoutType;
}
export declare const Label: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("@lifesg/react-design-system/typography").TypographyProps & {
    ref?: import("react").RefObject<HTMLParagraphElement>;
}, ILabelProps>> & string;
export declare const StyledRadioButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/radio-button").RadioButtonProps, never>> & string & Omit<({ className, checked, disabled, displaySize, onChange, ...otherProps }: import("@lifesg/react-design-system/radio-button").RadioButtonProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const StyledImageButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/image-button").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, never>> & string & Omit<(props: import("@lifesg/react-design-system/image-button").ImageButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export declare const RadioContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const FlexImageWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const FlexToggleWrapper: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, IToggleWrapperProps>> & string;
export declare const StyledToggle: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/toggle").ToggleProps, never>> & string & Omit<({ type, indicator, checked, styleType, children, childrenMaxLines, subLabel, disabled, error, name, id, className, compositeSection, removable, onRemove, "data-testid": testId, onChange, useContentWidth, "aria-describedby": ariaDescribedBy, ...otherProps }: import("@lifesg/react-design-system/toggle").ToggleProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export {};
