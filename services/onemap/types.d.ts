export type OneMapGeocodeInfo = {
    BUILDINGNAME: string;
    BLOCK: string;
    ROAD: string;
    POSTALCODE: string;
    XCOORD: string;
    YCOORD: string;
    LATITUDE: string;
    LONGITUDE: string;
};
export type OneMapSearchParam = {
    searchValue: string;
    returnGeom: OneMapBoolean;
    getAddressDetails: OneMapBoolean;
    pageNum: number;
};
export declare enum OneMapBoolean {
    YES = "Y",
    NO = "N"
}
export type OneMapSearchResults = {
    found: number;
    totalNumPages: number;
    pageNum: number;
    results: OneMapSearchBuildingResult[];
};
export type OneMapSearchBuildingResult = {
    SEARCHVAL: string;
    BLK_NO: string;
    ROAD_NAME: string;
    BUILDING: string;
    ADDRESS: string;
    POSTAL: string;
    X: string;
    Y: string;
    LATITUDE: string;
    LONGITUDE: string;
    DISPLAY_ADDRESS?: string;
};
export interface IColor {
    r: number;
    g: number;
    b: number;
}
export declare class OneMapError extends Error {
    innerError: any;
    constructor(error: any, message?: string);
}
