import { TPanelInputMode } from "../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
interface IModalBoxStyle {
    locationModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    ref?: import("react").Ref<HTMLDivElement>;
}, "locationModalStyles"> & IModalBoxStyle, never> & Partial<Pick<import("styled-components").FastOmit<Omit<import("@lifesg/react-design-system").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    ref?: import("react").Ref<HTMLDivElement>;
}, "locationModalStyles"> & IModalBoxStyle, never>>> & string & Omit<(props: import("@lifesg/react-design-system").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>) => React.ReactElement | null, keyof import("react").Component<any, {}, any>>;
export declare const StyledLocationPicker: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("./location-picker/types").ILocationPickerProps, "panelInputMode"> & ISinglePanelStyle, never> & Partial<Pick<import("styled-components").FastOmit<import("./location-picker/types").ILocationPickerProps, "panelInputMode"> & ISinglePanelStyle, never>>> & string & Omit<({ id, className, mapPanZoom, panelInputMode, showLocationModal, selectedLocationCoord, interactiveMapPinIconUrl, getCurrentLocation, locationAvailable, gettingCurrentLocation, onMapCenterChange, mapBannerText, disableSelectionFromMap, disableSelectedLocationMarker, selectablePins, pinsOnlyIndicateCurrentLocation, currentLocation, legendItems, defaultAddress, }: import("./location-picker/types").ILocationPickerProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const ErrorImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>>> & string;
export declare const PrefetchImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never> & Partial<Pick<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>>> & string;
export {};
