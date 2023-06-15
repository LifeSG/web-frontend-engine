import { MediaWidths } from "@lifesg/react-design-system";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import CurrentLocationUnavailable from "../../../../../assets/img/icons/current-location-unavailable.svg";
import CurrentLocation from "../../../../../assets/img/icons/current-location.svg";
import LocationPinBlue from "../../../../../assets/img/icons/location-pin-blue.svg";
import { TestHelper } from "../../../../../utils";
import { ButtonLocation, ButtonLocationImage, LeafletWrapper, LocationPickerWrapper } from "./location-picker.styles";

interface ILocationCoord {
	lat: number;
	lng: number;
}

interface IMapPin extends ILocationCoord {
	address?: string | undefined;
	resultListItemText?: string | undefined;
}

const markerFrom = ({ lat, lng }: IMapPin, iconUrl: string, isSelected?: boolean | undefined): L.Marker => {
	const pinSize = isSelected ? 44 : 32;

	return L.marker([lat, lng], {
		icon: L.icon({
			iconUrl,
			iconSize: [pinSize, pinSize],
			iconAnchor: [pinSize / 2, pinSize],
		}),
	});
};

const removeMarkers = (markers: L.Marker[] | undefined) => {
	if (!markers) return;
	markers.forEach((marker) => marker.remove());
};

export interface ILocationPickerProps extends React.InputHTMLAttributes<HTMLDivElement> {
	id?: string | undefined;
	className?: string | undefined;
	mapPanZoom?:
		| {
				mobile?: number | undefined;
				nonMobile?: number | undefined;
				min?: number | undefined;
		  }
		| undefined;
	showLocationPicker: boolean;
	selectedLocationCoord?: ILocationCoord | undefined;
	interactiveMapPinIconUrl?: string | undefined;
	getCurrentLocation: () => void;
	locationAvailable: boolean;
	gettingCurrentLocation: boolean;
	onMapCenterChange: (latlng: ILocationCoord) => void;
}

export const LocationPicker = ({
	id = "location-picker",
	className,
	mapPanZoom,
	showLocationPicker,
	selectedLocationCoord,
	interactiveMapPinIconUrl = LocationPinBlue,
	getCurrentLocation,
	locationAvailable,
	gettingCurrentLocation,
	onMapCenterChange,
}: ILocationPickerProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const mapRef = useRef<L.Map>();

	const leafletWrapperRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<L.Marker[]>();
	const isMobile = window.matchMedia(`(max-width: ${MediaWidths.tablet}px)`).matches;
	const MIN_ZOOM_VALUE = 11;
	const PAN_ZOOM_VALUE = Math.max(
		mapPanZoom?.min ?? MIN_ZOOM_VALUE,
		isMobile ? mapPanZoom?.mobile ?? 18 : mapPanZoom?.nonMobile ?? 17
	);
	const MAX_ZOOM_VALUE = isMobile ? 20 : 19;
	const MAX_NATIVE_ZOOM_VALUE = 18;

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		return () => {
			if (mapRef.current) {
				mapRef.current?.off();
				mapRef.current?.remove();
				mapRef.current = undefined;
			}
		};
	}, []);

	/**
	 * Attach map and keep ref
	 */
	useEffect(() => {
		/**
		 * If component has mounted and is in map mode OR double panel (location picker is alway on for double panel)
		 */
		if (leafletWrapperRef.current && showLocationPicker) {
			/**
			 * If there is not map set currently and show changed and should show, generate map
			 * cache map on location modal
			 */
			if (!mapRef.current) {
				mapRef.current = L.map(leafletWrapperRef.current, { zoomControl: false });
				resetView();
				L.control
					.zoom({
						position: "bottomright",
					})
					.addTo(mapRef.current);
			}
			const basemap = L.tileLayer("https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png", {
				detectRetina: true,
				maxNativeZoom: MAX_NATIVE_ZOOM_VALUE,
				maxZoom: MAX_ZOOM_VALUE,
				minZoom: MIN_ZOOM_VALUE,
				// Do not remove this attribution
				attribution:
					'<div class="onemap"><img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a></div>',
			});

			mapRef.current.setMaxBounds([
				[1.56073, 104.1147],
				[1.16, 103.502],
			]);
			basemap.addTo(mapRef.current);
		}
	}, [showLocationPicker]);

	useEffect(() => {
		const map = mapRef.current;

		// reattach map from location modal
		if (!showLocationPicker || !map) return;

		map.on("click", ({ latlng }: L.LeafletMouseEvent) => {
			if (!gettingCurrentLocation) {
				onMapCenterChange(latlng);
			}
		});

		map.on("zoomend", () => map.setMinZoom(mapPanZoom?.min ?? MIN_ZOOM_VALUE));

		return () => {
			map.off("click");
			map.off("zoomend");
		};
	}, [showLocationPicker, mapRef, gettingCurrentLocation, onMapCenterChange]);

	useEffect(() => {
		if (!showLocationPicker) return;
		// TODO move this else where
		// To centre on the current location after it has been retrieved,
		// even if it didn't change, as it may have panned off-centre.
		// when toggling from search to map?
		if (!gettingCurrentLocation && selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
			// NOTE: map will zoom when input is cleared in search panelInputMode and switches to map panelInputMode
			zoomWithMarkers({ lat: selectedLocationCoord.lat, lng: selectedLocationCoord.lng });
		}
	}, [showLocationPicker]);

	/**
	 * Centre map to selected location from search result
	 */
	useEffect(() => {
		if (showLocationPicker && selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
			zoomWithMarkers(selectedLocationCoord);
		} else {
			resetView();
		}
	}, [selectedLocationCoord.lat, selectedLocationCoord.lng]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const resetView = () => {
		if (mapRef.current && showLocationPicker) {
			removeMarkers(markersRef.current);
			const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
			mapRef.current.setView([center.x, center.y], 12);
			setTimeout(() => mapRef.current?.invalidateSize(), 500);
		}
	};

	const zoomWithMarkers = (target: ILocationCoord) => {
		const map = mapRef.current;
		if (!showLocationPicker || !map) return;
		removeMarkers(markersRef.current);

		markersRef.current = [markerFrom(target, interactiveMapPinIconUrl).addTo(map)];

		const zoomValue =
			map.getBounds().contains([target.lat, target.lng]) && map.getZoom() > PAN_ZOOM_VALUE
				? map.getZoom()
				: PAN_ZOOM_VALUE;

		map.flyTo(L.latLng(target.lat, target.lng), zoomValue);
		setTimeout(() => map.invalidateSize(), 500);
	};

	return (
		<LocationPickerWrapper
			className={className}
			id={TestHelper.generateId(id, "location-picker")}
			data-testid={TestHelper.generateId(id, "location-picker", showLocationPicker ? "show" : "hide")}
		>
			<LeafletWrapper ref={leafletWrapperRef} />
			<ButtonLocation
				onClick={() => {
					locationAvailable && getCurrentLocation();
				}}
			>
				<ButtonLocationImage
					src={locationAvailable ? CurrentLocation : CurrentLocationUnavailable}
					alt={`Current location ${locationAvailable ? "available" : "unavailable"}`}
				/>
			</ButtonLocation>
		</LocationPickerWrapper>
	);
};
