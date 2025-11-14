/// <reference types="react" />
interface SizeProps {
    size?: "large";
    width?: string;
}
export declare const ScrollableModal: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/modal").ModalProps, never>> & string & Omit<(({ id, show, animationFrom, children, enableOverlayClick, rootComponentId, zIndex, onOverlayClick, dismissKeyboardOnShow, ...otherProps }: import("@lifesg/react-design-system/modal").ModalProps) => JSX.Element) & {
    Box: ({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => import("react/jsx-runtime").JSX.Element;
}, keyof import("react").Component<any, {}, any>>;
export declare const GrowContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const Container: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, SizeProps>> & string;
export declare const PromptImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>> & string;
export declare const PromptButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<Omit<import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, SizeProps>> & string & Omit<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export declare const ButtonContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, SizeProps>> & string;
export declare const LabelContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, SizeProps>> & string;
export declare const Description: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/typography").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement>;
}, never>> & string;
export declare const Title: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("@lifesg/react-design-system/typography").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement>;
}, SizeProps>> & string;
export {};
