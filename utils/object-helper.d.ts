export declare namespace ObjectHelper {
    export const upsert: <T>(data: Record<string, T>, key: string, value: T) => Record<string, T>;
    interface GetNestedValueByKeyOptions {
        /** whether to skip searching at root level */
        skipRoot?: boolean | undefined;
        /** restrict which nested keys to find in */
        searchIn?: string[] | undefined;
    }
    export const getNestedValueByKey: <T>(data: Record<string, T>, key: string, options?: GetNestedValueByKeyOptions) => Record<string, T>;
    /**
     * removes undefined, null, {}, []
     */
    export const removeNil: (data: unknown) => any;
    export {};
}
