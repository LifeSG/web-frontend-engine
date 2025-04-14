/**
 * prevents inferrence
 * https://stackoverflow.com/questions/56687668/a-way-to-disable-type-argument-inference-in-generics
 */
export type TNoInfer<T, U> = [T][T extends U ? 0 : never];

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};

export type TFieldEventListener<T = undefined> = (event: CustomEvent<T>) => void;

// Gets a union of numbers from 1 to N e.g. Range<3> evaluates to 1 | 2 |3
export type Range<N extends number, Result extends number[] = []> = Result["length"] extends N
	? Exclude<Result[number] | N, 0>
	: Range<N, [...Result, Result["length"]]>;

//Increments a numeric literal e.g. AddOne<1> evaluates to 2
export type AddOne<N extends number, Result extends number[] = []> = Result["length"] extends N
	? [...Result, Result["length"]]["length"]
	: AddOne<N, [...Result, Result["length"]]>;
