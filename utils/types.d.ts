/**
 * prevents inferrence
 * https://stackoverflow.com/questions/56687668/a-way-to-disable-type-argument-inference-in-generics
 */
export type TNoInfer<T, U> = [T][T extends U ? 0 : never];
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export type TFieldEventListener<T = undefined> = (event: CustomEvent<T>) => void;
