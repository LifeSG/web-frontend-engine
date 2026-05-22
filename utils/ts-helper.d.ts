export type TDistributiveOmit<T, K extends PropertyKey> = T extends T ? Omit<T, K> : never;
