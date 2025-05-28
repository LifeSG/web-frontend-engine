/// <reference types="react" />
import { TPanelInputMode } from "../../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
export declare const SearchWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, ISinglePanelStyle, never>;
export declare const SearchBarContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    hasScrolled?: boolean;
}, never>;
export declare const SearchBarIconButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {}, never>;
export declare const SearchBarIconWrapper: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {}, never>;
export declare const SearchBarInput: import("styled-components").StyledComponent<"input", import("styled-components").DefaultTheme, {}, never>;
export declare const SearchBarModalCross: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {}, never>;
export declare const SearchBarCross: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {}, never>;
export declare const ResultWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, ISinglePanelStyle, never>;
export declare const ResultTitle: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps, never>;
export declare const NoResultTitle: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps, never>;
export declare const ResultItem: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    active?: boolean;
}, never>;
export declare const ResultItemPin: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {}, never>;
export declare const ButtonWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, ISinglePanelStyle, never>;
export declare const ButtonItem: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {
    buttonType: "cancel" | "confirm";
}, never>;
export declare const SearchIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {}, never>;
export {};
