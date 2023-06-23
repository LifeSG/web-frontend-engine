import { IMapPin } from "./types";
import * as L from "leaflet";

export const markerFrom = ({ lat, lng }: IMapPin, iconUrl: string, isSelected?: boolean | undefined): L.Marker => {
	const pinSize = isSelected ? 44 : 32;

	return L.marker([lat, lng], {
		icon: L.icon({
			iconUrl,
			iconSize: [pinSize, pinSize],
			iconAnchor: [pinSize / 2, pinSize],
		}),
	});
};

export const removeMarkers = (markers: L.Marker[] | undefined) => {
	if (!markers) return;
	markers.forEach((marker) => marker.remove());
};
