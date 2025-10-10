import { ILocationModalProps } from "./types";
/**
 * Location modal screen variation
 * Mobile or tablet - single panel
 * Desktop - double panel
 */
declare const LocationModal: ({ id, className, formValues, showLocationModal, mapPanZoom, interactiveMapPinIconUrl, reverseGeoCodeEndpoint, convertLatLngToXYEndpoint, gettingCurrentLocationFetchMessage, mapBannerText, mustHavePostalCode, locationModalStyles, onClose, onConfirm, updateFormValues, locationListTitle, locationSelectionMode, disableSearch, addressFieldPlaceholder, searchBarIcon, bufferRadius, }: ILocationModalProps) => import("react/jsx-runtime").JSX.Element;
export default LocationModal;
