export declare const useFormValues: () => {
    formValues: Record<string, unknown>;
    getField: (id: string) => unknown;
    setFields: (values: Record<string, unknown>) => void;
    setField: (id: string, value: unknown) => void;
    resetFields: (values: Record<string, unknown>) => void;
};
