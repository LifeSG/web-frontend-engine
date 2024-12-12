import { IMapPin } from "./types";
import * as L from "leaflet";
export declare const markerFrom: ({ lat, lng }: IMapPin, iconUrl: string, isSelected?: boolean | undefined) => L.Marker;
export declare const removeMarkers: (markers: L.Marker[] | undefined) => void;
