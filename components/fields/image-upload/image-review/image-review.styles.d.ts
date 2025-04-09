/// <reference types="react" />
interface IModalBoxStyle {
    imageReviewModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components").StyledComponent<({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => import("react/jsx-runtime").JSX.Element, any, IModalBoxStyle, never>;
export declare const HeaderSection: import("styled-components").StyledComponent<"div", any, {
    $drawActive?: boolean;
}, never>;
export declare const ReviewCloseButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/icon-button").IconButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, {}, never>;
export declare const ReviewTitle: import("styled-components").StyledComponent<"h5", any, import("@lifesg/react-design-system/v2_text").V2_TextProps, never>;
export declare const EditHeaderButton: import("styled-components").StyledComponent<"button", any, {}, never>;
export declare const ContentSection: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const LoadingPreviewText: import("styled-components").StyledComponent<"h4", any, import("@lifesg/react-design-system/v2_text").V2_TextProps, never>;
export declare const DrawDeleteButtonWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const DrawDeleteButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/icon-button").IconButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, {}, never>;
export declare const DrawDeleteButtonText: import("styled-components").StyledComponent<"h6", any, import("@lifesg/react-design-system/v2_text").V2_TextProps & {
    $disabled: boolean;
}, never>;
export declare const DrawIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, any, {
    $disabled: boolean;
}, never>;
export declare const DeleteIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, any, {
    $disabled: boolean;
}, never>;
export declare const ImageEditorWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const FooterSection: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const FooterSaveButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, {}, never>;
export declare const EraserButton: import("styled-components").StyledComponent<"button", any, {}, never>;
export declare const EraserButtonIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, any, {
    $eraseMode: boolean;
}, never>;
export declare const ButtonIcon: import("styled-components").StyledComponent<{
    (props: import("react").SVGProps<SVGSVGElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, any, {
    $colorScheme: string;
}, never>;
export declare const PaletteHolder: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Palette: import("styled-components").StyledComponent<"button", any, {
    $color: string;
    $colorScheme?: string;
}, never>;
export {};
