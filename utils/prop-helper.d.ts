declare const COMMON_SCHEMA_PROP_KEYS: readonly ["columns", "customOptions", "label", "referenceKey", "showIf", "uiType", "validation"];
type CommonSchemaPropKey = (typeof COMMON_SCHEMA_PROP_KEYS)[number];
type ExistingCommonSchemaPropKey<T extends object> = Extract<CommonSchemaPropKey, keyof T>;
export declare const filterSchemaProps: <T extends object>(schema: T) => {
    commonSchema: Pick<T, ExistingCommonSchemaPropKey<T>>;
    customSchema: Omit<T, ExistingCommonSchemaPropKey<T>>;
};
export {};
