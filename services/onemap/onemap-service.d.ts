import { IColor, OneMapBoolean, OneMapGeocodeInfo, OneMapSearchParam, OneMapSearchResults } from "./types";
type TReverseGeocodeParams = {
    route: string;
    latitude: number;
    longitude: number;
    abortSignal?: AbortSignal;
    bufferRadius?: number;
    otherFeatures?: OneMapBoolean;
    recaptchaToken?: string;
    headers?: Record<string, string>;
};
export declare const OneMapService: {
    reverseGeocode: ({ route, latitude, longitude, abortSignal, bufferRadius, otherFeatures, recaptchaToken, headers, }: TReverseGeocodeParams) => Promise<OneMapGeocodeInfo[]>;
    searchByAddress: (param: OneMapSearchParam, route?: string, recaptchaToken?: string, headers?: Record<string, string>) => Promise<OneMapSearchResults>;
    convertLatLngToXY: (route: string, latitude: number, longitude: number, recaptchaToken?: string, headers?: Record<string, string>) => Promise<{
        X: number;
        Y: number;
    }>;
    getStaticMapUrl: (lat: number, lng: number, width: number, height: number, pinColor: IColor) => string;
};
export {};
