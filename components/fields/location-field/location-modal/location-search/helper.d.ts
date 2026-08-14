import { IResultListItem } from "../..";
export declare const pagination: <T>(array: T[], pageSize: number, pageNum: number) => T[];
export declare const boldResultsWithQuery: (arr: IResultListItem[], query: string) => {
    displayAddressText: string;
    address?: string | undefined;
    blockNo?: string | undefined;
    building?: string | undefined;
    postalCode?: string | undefined;
    roadName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
}[];
