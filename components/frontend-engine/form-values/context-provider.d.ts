import { Dispatch, MutableRefObject, ReactElement, SetStateAction } from "react";
interface IFormValuesContext {
    formValues: Record<string, unknown>;
    formValuesRef: MutableRefObject<Record<string, unknown>>;
    setFormValues: Dispatch<SetStateAction<Record<string, unknown>>>;
}
interface IProps {
    children: ReactElement;
}
export declare const FormValuesContext: import("react").Context<IFormValuesContext>;
/**
 * This context stores the form values in parallel to react-hook-form's state.
 *
 * The main difference is that it persists the values of fields that are currently conditionally hidden.
 * Otherwise we won't be able to get their previous values (as the fields are unregistered from react-hook-form).
 *
 * This is used to populate the values of conditionally rendered fields when they are shown again.
 *
 */
export declare const FormValuesProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
