/// <reference types="react" />
interface InsetStyleProps {
    $inset?: string | number;
}
export declare const Inset: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, InsetStyleProps, never>;
export declare const SectionHeader: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const RemoveButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const AddButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const SectionDivider: import("styled-components").StyledComponent<({ thickness, lineStyle, layoutType, color, className, xxsCols, xsCols, smCols, mdCols, lgCols, xlCols, xxlCols, mobileCols, tabletCols, desktopCols, ...otherProps }: import("@lifesg/react-design-system/divider").DividerProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export declare const WarningAlert: import("styled-components").StyledComponent<({ id, message, className }: import("../../shared").IWarningProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export declare const CustomErrorDisplay: import("styled-components").StyledComponent<({ type, img, title, description, actionButton, additionalProps, imageOnly, illustrationScheme, ...otherProps }: import("@lifesg/react-design-system/error-display").ErrorDisplayProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export {};
