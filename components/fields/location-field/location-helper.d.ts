/// <reference types="lodash" />
import * as L from "leaflet";
import { MutableRefObject } from "react";
import { OneMapBoolean, OneMapGeocodeInfo, OneMapSearchBuildingResult } from "../../../services/onemap/types";
import { ILocationCoord, IResultListItem, IResultsMetaData } from "./types";
type TReverseGeocodeParams = {
    route: string;
    latitude: number;
    longitude: number;
    abortSignal?: AbortSignal;
    bufferRadius?: number;
    otherFeatures?: OneMapBoolean;
    options?: {
        excludeNonSG: boolean;
    };
};
export declare namespace LocationHelper {
    const getMapBounds: () => L.LatLngBounds;
    const getStaticMapUrl: (lat: number, lng: number, width: number, height: number, pinColor: import("../../../services/onemap/types").IColor) => string;
    const searchByAddress: (param: import("../../../services/onemap/types").OneMapSearchParam) => Promise<import("../../../services/onemap/types").OneMapSearchResults>;
    const fetchLocationList: (reverseGeoCodeEndpoint: string, lat: number, lng: number, mustHavePostalCode: boolean, reverseGeocodeAborter: MutableRefObject<AbortController>, onError: (error: any) => void, excludeNonSG?: boolean) => Promise<IResultListItem[]>;
    const fetchAddress: (query: string, pageNumber: number, onSuccess?: (results: IResultsMetaData) => void, onFail?: (error: unknown) => void) => Promise<void>;
    const fetchSingleLocationByAddress: (address: string, onSuccess: (resultListItem: IResultListItem | undefined) => void, onError: (e: any) => void) => Promise<void>;
    const debounceFetchAddress: import("lodash").DebouncedFunc<(query: string, pageNumber: number, onSuccess?: (results: IResultsMetaData) => void, onFail?: (error: unknown) => void) => Promise<void>>;
    const reverseGeocode: ({ options, ...others }: TReverseGeocodeParams) => Promise<IResultsMetaData>;
    const fetchSingleLocationByLatLng: (reverseGeoCodeEndpoint: string, lat: number, lng: number, onSuccess: (resultListItem: IResultListItem | undefined) => void, onError: (e: any) => void) => Promise<void>;
    const hasGotAddressValue: (value?: string) => boolean;
    const formatAddressFromGeocodeInfo: (geocodeInfo: OneMapGeocodeInfo | OneMapSearchBuildingResult, fallbackToLatLng?: boolean) => string;
    const isOneMapSearchBuildingResults: (geoCodeInfo: OneMapGeocodeInfo | OneMapSearchBuildingResult) => geoCodeInfo is OneMapSearchBuildingResult;
    const isCoordinateInBounds: (coordinate: ILocationCoord) => boolean;
}
export {};
