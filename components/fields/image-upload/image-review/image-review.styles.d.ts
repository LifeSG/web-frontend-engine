/// <reference types="react" />
interface IModalBoxStyle {
    imageReviewModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components").StyledComponent<({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, IModalBoxStyle, never>;
export declare const HeaderSection: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    $drawActive?: boolean;
}, never>;
export declare const ReviewCloseButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/icon-button").IconButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const ReviewTitle: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps, never>;
export declare const EditHeaderButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {}, never>;
export declare const ContentSection: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const LoadingPreviewText: import("styled-components").StyledComponent<keyof JSX.IntrinsicElements, import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps, never>;
export declare const DrawDeleteButtonWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const DrawDeleteButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/icon-button").IconButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const DrawDeleteButtonText: import("styled-components").StyledComponent<"p", import("styled-components").DefaultTheme, import("@lifesg/react-design-system/typography").TypographyProps & {
    $disabled: boolean;
}, never>;
export declare const DrawIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {
    $disabled: boolean;
}, never>;
export declare const DeleteIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {
    $disabled: boolean;
}, never>;
export declare const ImageEditorWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const FooterSection: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const FooterSaveButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, import("styled-components").DefaultTheme, {}, never>;
export declare const EraserButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {}, never>;
export declare const EraserButtonIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {
    $eraseMode: boolean;
}, never>;
export declare const ButtonIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, import("styled-components").DefaultTheme, {
    $colorScheme: string;
}, never>;
export declare const PaletteHolder: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Palette: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {
    $color: string;
    $colorScheme?: string;
}, never>;
export {};
