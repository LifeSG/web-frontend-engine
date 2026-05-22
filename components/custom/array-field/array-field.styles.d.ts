/// <reference types="react" />
interface InsetStyleProps {
    $inset?: string | number;
}
interface RemoveButtonStyleProps {
    $alignment?: "left" | "right";
}
export declare const Inset: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$inset"> & InsetStyleProps, never> & Partial<Pick<import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "$inset"> & InsetStyleProps, never>>> & string;
export declare const SectionHeader: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>> & string;
export declare const RemoveButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, "$alignment"> & RemoveButtonStyleProps, never> & Partial<Pick<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, "$alignment"> & RemoveButtonStyleProps, never>>> & string & Omit<(props: import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export declare const AddButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, never> & Partial<Pick<Omit<import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    ref?: import("react").Ref<HTMLButtonElement>;
}, never>>> & string & Omit<(props: import("@lifesg/react-design-system/button-with-icon").ButtonWithIconProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export declare const SectionDivider: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/divider").DividerProps, never> & Partial<Pick<import("@lifesg/react-design-system/divider").DividerProps, never>>> & string & Omit<({ thickness, lineStyle, layoutType, color, className, xxsCols, xsCols, smCols, mdCols, lgCols, xlCols, xxlCols, mobileCols, tabletCols, desktopCols, ...otherProps }: import("@lifesg/react-design-system/divider").DividerProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const WarningAlert: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("../../shared").IWarningProps, never> & Partial<Pick<import("../../shared").IWarningProps, never>>> & string & Omit<({ id, message, className }: import("../../shared").IWarningProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const CustomErrorDisplay: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("@lifesg/react-design-system/error-display").ErrorDisplayProps, never> & Partial<Pick<import("@lifesg/react-design-system/error-display").ErrorDisplayProps, never>>> & string & Omit<({ type, img, title, description, actionButton, additionalProps, imageOnly, illustrationScheme, ...otherProps }: import("@lifesg/react-design-system/error-display").ErrorDisplayProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export {};
