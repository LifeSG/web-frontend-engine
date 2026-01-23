import { TFieldEventListener } from "../../../utils";
import { IYupValidationRule } from "../../frontend-engine";
import { IStaticMapProps } from "../../shared";
import { IBaseFieldSchema } from "../types";
import { ILocationInputProps } from "./location-input";
import { ILocationPickerProps, IMapPin } from "./location-modal/location-picker/types";
import { ILocationSearchProps } from "./location-modal/location-search/types";
import { ILocationModalProps } from "./location-modal/types";
export interface ILocationFieldValidation extends IYupValidationRule {
    postalCode?: boolean | undefined;
}
export interface ILocationFieldSchema<V = undefined> extends IBaseFieldSchema<"location-field", V, ILocationFieldValidation>, Pick<ILocationPickerProps, "interactiveMapPinIconUrl" | "mapPanZoom">, Pick<ILocationSearchProps, "reverseGeoCodeEndpoint" | "convertLatLngToXYEndpoint" | "mustHavePostalCode" | "gettingCurrentLocationFetchMessage" | "hasExplicitEdit" | "disableSearch" | "addressFieldPlaceholder" | "searchBarIcon" | "bufferRadius">, Pick<ILocationInputProps, "locationInputPlaceholder" | "disabled" | "readOnly">, Pick<IStaticMapProps, "staticMapPinColor">, Pick<ILocationModalProps, "locationSelectionMode"> {
    className?: string;
    locationModalStyles?: string | undefined;
    locationListTitle?: string | undefined;
    mapBannerText?: string | undefined;
    pinsOnlyIndicateCurrentLocation?: boolean | undefined;
}
export type TSinglePanelInputMode = "search" | "map";
export type TExplicitEditMode = "show" | "explicit";
export type TPanelInputMode = "search" | "map" | "double";
export interface ILocationFieldValues {
    address?: string | undefined;
    blockNo?: string | undefined;
    building?: string | undefined;
    postalCode?: string | undefined;
    roadName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
}
export interface ILocationCoord {
    lat: number;
    lng: number;
}
export interface IResultListItem extends ILocationFieldValues {
    displayAddressText?: string | undefined;
}
export interface IResultsMetaData {
    results: IResultListItem[];
    apiPageNum?: number | undefined;
    totalNumPages?: number | undefined;
}
export interface IDisplayResultListParams extends IResultsMetaData {
    queryString?: string | undefined;
    boldResults?: boolean | undefined;
}
export type TErrorType = {
    errorType: "OneMapError" | "GetLocationError" | "GetLocationTimeoutError" | "PostalCodeError";
};
export interface TLocationFieldDetail<T = unknown> {
    payload?: T | undefined;
    errors?: any | undefined;
}
export type TSetCurrentLocationDetail = TLocationFieldDetail<ILocationCoord>;
export type TLocationFieldErrorDetail = TLocationFieldDetail<TErrorType>;
export type TLocationFieldEvents = {
    "get-current-location": CustomEvent;
    "set-current-location": CustomEvent<TSetCurrentLocationDetail>;
    error: CustomEvent<TLocationFieldErrorDetail>;
    "error-end": CustomEvent<TLocationFieldErrorDetail>;
    "set-selectable-pins": CustomEvent<{
        pins: IMapPin[];
    }>;
};
export declare class GeolocationPositionErrorWrapper extends Error {
    code: any;
    message: any;
    constructor(error: GeolocationPositionError);
}
/** fired on showing location modal */
declare function locationFieldEvent(uiType: "location-field", type: "show-location-modal", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/** fired on dismissing location modal */
declare function locationFieldEvent(uiType: "location-field", type: "hide-location-modal", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired on clicking edit button (edit button is only render with `hasExplicitEdit:true` and if a location is selected)
 *
 * `event.preventDefault()` will stop location modal from being shown
 * */
declare function locationFieldEvent(uiType: "location-field", type: "click-edit-button", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired immediately on clicking refresh current location button in location picker
 *
 * `event.preventDefault()` will prevent the search copy from being updated and stop the retrieval of current location
 *
 * Note: if event is prevented, dispatch `trigger-get-current-location` to resume logic
 * */
declare function locationFieldEvent(uiType: "location-field", type: "click-refresh-current-location", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired on attempting to get current location, after search bar copy has been updated to indicate it is getting current location
 *
 * `event.preventDefault()` will stop the retrieval of current location.
 *
 * Note: if event is prevented, dispatch `set-current-location` to set current location and resume the rest of the logic
 * */
declare function locationFieldEvent(uiType: "location-field", type: "get-current-location", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/** fired after determining current location, before updating search results */
declare function locationFieldEvent(uiType: "location-field", type: "get-selectable-pins", id: string, listener: TFieldEventListener<ILocationCoord>, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired on confirming selected address in the location modal
 *
 * `event.preventDefault()` will stop the selected address from being passed into Frontend Engine and from dismissing the location modal
 *
 * Note: if event is prevented, dispatch `confirm-location` to confirm location and dismiss location modal
 */
declare function locationFieldEvent(uiType: "location-field", type: "click-confirm-location", id: string, listener: TFieldEventListener<ILocationFieldValues>, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired before request location permission modal is dismissed
 *
 * `event.preventDefault()` will stop the permission modal from being dismissed
 *
 * Note: if event is prevented, dispatch `hide-permission-modal` to dismiss the permission modal
 * */
declare function locationFieldEvent(uiType: "location-field", type: "before-hide-permission-modal", id: string, listener: TFieldEventListener, options?: boolean | AddEventListenerOptions | undefined): void;
/**
 * fired when there is an error due to:
 * - failure in calling reverse geocode endpoint
 * - failure in performing location search via onemap
 * - `set-current-location` event contains error
 *
 * `event.preventDefault()` will prevent the error from being handled and respective error modal from being shown
 *
 *  Note: if event is prevented, dispatch `error-end` to dismiss any error modals
 **/
declare function locationFieldEvent(uiType: "location-field", type: "error", id: string, listener: TFieldEventListener<TLocationFieldErrorDetail>, options?: boolean | AddEventListenerOptions | undefined): void;
export type TLocationEvents = typeof locationFieldEvent;
/** shows location modal */
declare function locationFieldTrigger(uiType: "location-field", type: "show-location-modal", id: string, details: TSetCurrentLocationDetail): boolean;
/** sets current location manually, this is meant to be triggered if `get-current-location` event is prevented */
declare function locationFieldTrigger(uiType: "location-field", type: "set-current-location", id: string, details: TSetCurrentLocationDetail): boolean;
/** dismisses error modal (if any), this is meant to be triggered if `error` event is prevented */
declare function locationFieldTrigger(uiType: "location-field", type: "error-end", id: string, details: TLocationFieldErrorDetail): void;
/** add pins to location picker */
declare function locationFieldTrigger(uiType: "location-field", type: "set-selectable-pins", id: string, details: {
    pins: IMapPin[];
}): void;
/** passes location info to Frontend Engine and dismisses location modal. this is meant to be triggered if `click-confirm-location` event is prevented */
declare function locationFieldTrigger(uiType: "location-field", type: "confirm-location", id: string, details: ILocationFieldValues): void;
/** dismisses location permission request modal. this is meant to be triggered if `before-hide-permission-modal` is prevented */
declare function locationFieldTrigger(uiType: "location-field", type: "hide-permission-modal", id: string): void;
/** dismisses the location modal and discards any location selected in the modal */
declare function locationFieldTrigger(uiType: "location-field", type: "dismiss-location-modal", id: string): void;
/** initiate attempt to get current location and updates the search bar to indicate it is getting current location. this is meant to be triggered if `click-refresh-current-location` event is prevented */
declare function locationFieldTrigger(uiType: "location-field", type: "trigger-get-current-location", id: string): void;
export type TLocationFieldTriggers = typeof locationFieldTrigger;
export {};
