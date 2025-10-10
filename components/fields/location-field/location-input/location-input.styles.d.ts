interface InputWrapperStyleProps {
    disabled?: boolean | undefined;
    $error?: boolean | undefined;
    $readOnly?: boolean | undefined;
    $focused?: boolean | undefined;
}
export declare const DummyLocationInput: import("styled-components").StyledComponent<"button", any, InputWrapperStyleProps, never>;
export declare const LocationInputText: import("styled-components").StyledComponent<"span", any, {
    $placeholder?: boolean;
    $disabled?: boolean;
}, never>;
export declare const LocationIconWrapper: import("styled-components").StyledComponent<"div", any, {
    $disabled?: boolean;
    $readOnly?: boolean;
}, never>;
export {};
