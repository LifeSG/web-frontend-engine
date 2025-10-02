/// <reference types="react" />
import { TPanelInputMode } from "../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
interface IModalBoxStyle {
    locationModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("@lifesg/react-design-system/modal").ModalBoxProps, IModalBoxStyle>> & string & Omit<({ id, children, onClose, showCloseButton, ...otherProps }: import("@lifesg/react-design-system/modal").ModalBoxProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const StyledLocationPicker: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("./location-picker/types").ILocationPickerProps, ISinglePanelStyle>> & string & Omit<({ id, className, mapPanZoom, panelInputMode, showLocationModal, selectedLocationCoord, interactiveMapPinIconUrl, getCurrentLocation, locationAvailable, gettingCurrentLocation, onMapCenterChange, mapBannerText, disableSelectionFromMap, disableCurrLocationMarker, selectablePins, }: import("./location-picker/types").ILocationPickerProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const ErrorImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>> & string;
export declare const PrefetchImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>> & string;
export {};
