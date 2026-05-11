/// <reference types="react" />
interface IDummyLocationFieldProps {
    id?: string | undefined;
    "data-testid"?: string | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    placeholder?: string | undefined;
    value?: string | number | readonly string[] | undefined;
    error?: boolean | undefined;
    onFocus: React.FocusEventHandler<HTMLElement>;
    className?: string | undefined;
}
export declare const DummyLocationField: (props: IDummyLocationFieldProps) => import("react/jsx-runtime").JSX.Element;
export {};
