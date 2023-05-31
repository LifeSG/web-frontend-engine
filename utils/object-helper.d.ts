export declare namespace ObjectHelper {
    const upsert: <T>(data: Record<string, T>, key: string, value: T) => Record<string, T>;
    const getNestedValueByKey: <T>(data: Record<string, T>, key: string) => Record<string, T>;
}
