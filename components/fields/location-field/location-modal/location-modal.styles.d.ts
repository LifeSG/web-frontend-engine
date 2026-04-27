/// <reference types="react" />
import { TPanelInputMode } from "../types";
interface ISinglePanelStyle {
    panelInputMode: TPanelInputMode;
}
interface IModalBoxStyle {
    locationModalStyles?: string | undefined;
}
export declare const ModalBox: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<Omit<import("@lifesg/react-design-system/modal").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    ref?: import("react").Ref<HTMLDivElement>;
}, IModalBoxStyle>> & string & Omit<(props: import("@lifesg/react-design-system/modal").ModalBoxProps & import("react").RefAttributes<HTMLDivElement>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>, keyof import("react").Component<any, {}, any>>;
export declare const StyledLocationPicker: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("./location-picker/types").ILocationPickerProps, ISinglePanelStyle>> & string & Omit<({ id, className, mapPanZoom, panelInputMode, showLocationModal, selectedLocationCoord, interactiveMapPinIconUrl, getCurrentLocation, locationAvailable, gettingCurrentLocation, onMapCenterChange, mapBannerText, disableSelectionFromMap, disableSelectedLocationMarker, selectablePins, pinsOnlyIndicateCurrentLocation, currentLocation, legendItems, }: import("./location-picker/types").ILocationPickerProps) => import("react/jsx-runtime").JSX.Element, keyof import("react").Component<any, {}, any>>;
export declare const ErrorImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>> & string;
export declare const PrefetchImage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, never>> & string;
export {};
