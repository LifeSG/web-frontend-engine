import { ReactElement, Ref } from "react";
import { IYupValidationRule } from "../../context-providers";
import { IFrontendEngineProps, IFrontendEngineRef, TNoInfer } from "./types";
/**
 * The one and only component needed to create your form
 *
 * Minimally you will need to set the `data` props which is the JSON schema to define the form
 *
 * Generics
 * - V = custom validation types
 * - C = custom component types
 */
export declare const FrontendEngine: <V = undefined, C = undefined>(props: IFrontendEngineProps<TNoInfer<V, IYupValidationRule>, C> & {
    ref?: Ref<IFrontendEngineRef>;
}) => ReactElement;
/**
 * casting as a function with generics as a way to define generics with forwardRef
 * the generics are a way to set custom definition of Yup validation config
 * `NoInfer` typing is to ensure validation config is either the default `IYupValidationRule` or explicitly typed
 * this prevent inferring from the data props entered by devs
 * can refer to `Add Custom Validation` story for more info
 */
