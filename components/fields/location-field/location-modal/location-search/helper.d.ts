import { IResultListItem } from "../..";
export declare const pagination: <T>(array: T[], pageSize: number, pageNum: number) => T[];
export declare const boldResultsWithQuery: (arr: IResultListItem[], query: string) => IResultListItem[];
