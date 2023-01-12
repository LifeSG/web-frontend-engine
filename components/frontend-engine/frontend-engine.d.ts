import { ReactElement, Ref } from "react";
import { IFrontendEngineProps, IFrontendEngineRef } from "./types";
import { IYupValidationRule } from "./yup";
/**
 * prevents inferrence
 * https://stackoverflow.com/questions/56687668/a-way-to-disable-type-argument-inference-in-generics
 */
type NoInfer<T, U> = [T][T extends U ? 0 : never];
/**
 * The one and only component needed to create your form
 *
 * Minimally you will need to set the `data` props which is the JSON schema to define the form
 */
export declare const FrontendEngine: <V = undefined>(props: IFrontendEngineProps<NoInfer<V, IYupValidationRule>> & {
    ref?: Ref<IFrontendEngineRef>;
}) => ReactElement;
export {};
/**
 * casting as a function with generics as a way to define generics with forwardRef
 * the generics are a way to set custom definition of Yup validation config
 * `NoInfer` typing is to ensure validation config is either the default `IYupValidationRule` or explicitly typed
 * this prevent inferring from the data props entered by devs
 * can refer to `Add Custom Validation` story for more info
 */
