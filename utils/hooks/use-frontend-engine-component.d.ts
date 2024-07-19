/**
 * returns various functions for custom component's use
 *
 * to be used within custom components
 */
export declare const useFrontendEngineComponent: () => {
    event: {
        addFieldEventListener: <T = any>(type: string, id: string, listener: (ev: CustomEvent<T>) => void, options?: boolean | AddEventListenerOptions) => void;
        dispatchFieldEvent: <T_1 = any>(type: string, id: string, detail?: T_1) => boolean;
        removeFieldEventListener: <T_2 = any>(type: string, id: string, listener: (ev: CustomEvent<T_2>) => void, options?: boolean | EventListenerOptions) => void;
    };
    formContext: import("react-hook-form").UseFormReturn<import("react-hook-form").FieldValues, any, undefined>;
    validation: {
        setValidation: <V = import("../..").IYupValidationRule<undefined, undefined>>(id: string, schema: import("yup").AnySchema<any, any, any>, validationRules?: V[]) => void;
        removeValidation: (id: string) => void;
    };
};
