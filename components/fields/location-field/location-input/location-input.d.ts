/// <reference types="react" />
import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
export interface ILocationInputProps extends FormInputGroupProps<string, string> {
    locationInputPlaceholder?: string | undefined;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}
export declare const LocationInput: (props: ILocationInputProps) => import("react/jsx-runtime").JSX.Element;
