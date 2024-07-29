import { IResultListItem } from "../..";
export declare const pagination: <T>(array: T[], pageSize: number, pageNum: number) => T[];
export declare const boldResultsWithQuery: (arr: IResultListItem[], query: string) => {
    displayAddressText: string;
    address?: string;
    blockNo?: string;
    building?: string;
    postalCode?: string;
    roadName?: string;
    lat?: number;
    lng?: number;
    x?: number;
    y?: number;
}[];
