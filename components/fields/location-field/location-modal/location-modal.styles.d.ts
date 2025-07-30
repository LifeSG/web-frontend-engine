import { TPanelInputMode } from "../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
interface IModalBoxStyle {
    locationModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components").StyledComponent<({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, IModalBoxStyle, never>;
export declare const StyledLocationPicker: import("styled-components").StyledComponent<({ id, className, mapPanZoom, panelInputMode, showLocationModal, selectedLocationCoord, interactiveMapPinIconUrl, getCurrentLocation, locationAvailable, gettingCurrentLocation, onMapCenterChange, mapBannerText, disableSelectionFromMap, disableCurrLocationMarker, selectablePins, }: import("./location-picker/types").ILocationPickerProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, ISinglePanelStyle, never>;
export declare const ErrorImage: import("styled-components").StyledComponent<"img", import("styled-components").DefaultTheme, {}, never>;
export declare const PrefetchImage: import("styled-components").StyledComponent<"img", import("styled-components").DefaultTheme, {}, never>;
export {};
