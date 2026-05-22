/**
 * returns various functions for custom component's use
 *
 * to be used within custom components
 */
export declare const useFrontendEngineComponent: () => {
    event: {
        addFieldEventListener: import("../../context-providers").TAddFieldEventListener;
        dispatchFieldEvent: <T = any>(arg1: string, arg2: string, arg3?: string | T, arg4?: T) => boolean;
        removeFieldEventListener: import("../../context-providers").TAddFieldEventListener;
    };
    formContext: import("react-hook-form").UseFormReturn<import("react-hook-form").FieldValues, any, undefined>;
    validation: {
        setValidation: <V = import("../..").IYupValidationRule<undefined, undefined>>(id: string, schema: import("yup").AnySchema<any, any, any>, validationRules?: V[]) => void;
        removeValidation: (id: string) => void;
    };
};
