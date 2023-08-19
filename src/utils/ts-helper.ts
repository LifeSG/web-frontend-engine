// TS does not have a distributive omit
// ref: https://davidgomes.com/pick-omit-over-union-types-in-typescript/
// ref: https://stackoverflow.com/questions/76928396/how-to-define-typescript-interfaces-with-predefined-string-literals-that-restric
export type TDistributiveOmit<T, K extends PropertyKey> = T extends T ? Omit<T, K> : never;
