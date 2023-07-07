/// <reference types="react" />
import { TPanelInputMode } from "../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
export declare const ModalBox: import("styled-components").StyledComponent<({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => JSX.Element, any, {}, never>;
export declare const StyledLocationPicker: import("styled-components").StyledComponent<({ id, className, mapPanZoom, panelInputMode, showLocationModal, selectedLocationCoord, interactiveMapPinIconUrl, getCurrentLocation, locationAvailable, gettingCurrentLocation, onMapCenterChange, }: import("./location-picker/types").ILocationPickerProps) => import("react/jsx-runtime").JSX.Element, any, ISinglePanelStyle, never>;
export declare const ErrorImage: import("styled-components").StyledComponent<"img", any, {}, never>;
export declare const PrefetchImage: import("styled-components").StyledComponent<"img", any, {}, never>;
export {};
