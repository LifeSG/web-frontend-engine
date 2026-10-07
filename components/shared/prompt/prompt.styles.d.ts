interface SizeProps {
    size?: "large";
    width?: string;
}
export declare const ScrollableModal: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").ModalProps, never> & Partial<Pick<import("@lifesg/react-design-system").ModalProps, never>>> & string & Omit<(({ id, show, animationFrom, children, enableOverlayClick, rootComponentId, zIndex, onOverlayClick, dismissKeyboardOnShow, ...otherProps }: import("@lifesg/react-design-system").ModalProps) => JSX.Element) & {
    Box: (props: import("@lifesg/react-design-system").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>) => React.ReactElement | null;
}, keyof import("react").Component<any, {}, any>>;
export declare const GrowContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
export declare const Container: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never>>> & string;
export declare const PromptImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>>> & string;
export declare const PromptButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system").ButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, keyof SizeProps> & SizeProps, never> & Partial<Pick<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system").ButtonProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, keyof SizeProps> & SizeProps, never>>> & string & Omit<(props: import("@lifesg/react-design-system").ButtonProps & React.RefAttributes<HTMLButtonElement>) => React.ReactElement | null, keyof import("react").Component<any, {}, any>>;
export declare const ButtonContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never>>> & string;
export declare const LabelContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof SizeProps> & SizeProps, never>>> & string;
export declare const Description: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, never> & Partial<Pick<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, never>>> & string;
export declare const Title: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, keyof SizeProps> & SizeProps, never> & Partial<Pick<import("styled-components").FastOmit<import("@lifesg/react-design-system").TypographyProps & {
    ref?: import("react").RefObject<HTMLHeadingElement> | undefined;
} & {
    as?: import("styled-components").WebTarget;
    forwardedAs?: import("styled-components").WebTarget;
}, keyof SizeProps> & SizeProps, never>>> & string;
export {};
