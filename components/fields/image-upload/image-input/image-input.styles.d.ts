/// <reference types="react" />
export interface SubtitleProps {
    $hasDescription?: boolean;
}
export declare const Wrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Subtitle: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps & SubtitleProps, never>;
export declare const Content: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const UploadWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const AddButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const DropThemHereText: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const AlertContainer: import("styled-components").StyledComponent<({ type, className, children, actionLink, actionLinkIcon, sizeType, showIcon, customIcon, maxCollapsedHeight, ...otherProps }: import("@lifesg/react-design-system/alert").AlertProps) => JSX.Element, import("styled-components").DefaultTheme, {}, never>;
