/// <reference types="react" />
interface SizeProps {
    size?: "large";
    width?: string;
}
export declare const Container: import("styled-components").StyledComponent<"div", any, SizeProps, never>;
export declare const PromptImage: import("styled-components").StyledComponent<"img", any, {}, never>;
export declare const PromptButton: import("styled-components").StyledComponent<(props: import("@lifesg/react-design-system/button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, any, SizeProps, never>;
export declare const ButtonContainer: import("styled-components").StyledComponent<"div", any, SizeProps, never>;
export declare const LabelContainer: import("styled-components").StyledComponent<"div", any, SizeProps, never>;
export declare const Description: import("styled-components").StyledComponent<"h4", any, import("@lifesg/react-design-system/text").TextProps, never>;
export declare const CallButton: import("styled-components").StyledComponent<"a", any, {}, never>;
export declare const BoldLetters: import("styled-components").StyledComponent<"strong", any, {}, never>;
export declare const Title: import("styled-components").StyledComponent<"h4", any, import("@lifesg/react-design-system/text").TextProps & SizeProps, never>;
export {};
