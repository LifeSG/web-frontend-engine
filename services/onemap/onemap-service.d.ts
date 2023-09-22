import { IColor, OneMapBoolean, OneMapGeocodeInfo, OneMapSearchParam, OneMapSearchResults } from "./types";
type TReverseGeocodeParams = {
    route: string;
    latitude: number;
    longitude: number;
    abortSignal?: AbortSignal;
    bufferRadius?: number;
    otherFeatures?: OneMapBoolean;
};
export declare const OneMapService: {
    reverseGeocode: ({ route, latitude, longitude, abortSignal, bufferRadius, otherFeatures, }: TReverseGeocodeParams) => Promise<OneMapGeocodeInfo[]>;
    searchByAddress: (param: OneMapSearchParam) => Promise<OneMapSearchResults>;
    getStaticMapUrl: (lat: number, lng: number, width: number, height: number, pinColor: IColor) => string;
};
export {};
