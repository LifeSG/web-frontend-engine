import { MediaWidths } from "@lifesg/react-design-system";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { TestHelper } from "../../../../../utils";
import CurrentLocationUnavailable from "../../../../../assets/img/icons/current-location-unavailable.svg";
import CurrentLocation from "../../../../../assets/img/icons/current-location.svg";
import LocationPinBlue from "../../../../../assets/img/icons/location-pin-blue.svg";
import { ButtonLocation, ButtonLocationImage, LeafletWrapper, LocationPickerWrapper } from "./location-picker.styles";

interface ILocationCoord {
	lat: number;
	lng: number;
}

interface IMapPin extends ILocationCoord {
	address?: string;
	resultListItemText?: string;
}

const markerFrom = ({ lat, lng }: IMapPin, iconUrl: string, isSelected?: boolean): L.Marker => {
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
	id?: string;
	className?: string;
	mapPanZoom?: {
		mobile?: number;
		nonMobile?: number;
		min?: number;
	};
	showLocationPicker: boolean;
	mapRef: React.MutableRefObject<L.Map | undefined>;
	selectedLocationCoord?: ILocationCoord;
	interactiveMapPinIconUrl?: string;
	onGetCurrentLocation: () => void;
	locationAvailable: boolean;
	gettingCurrentLocation: boolean;
	onMapCenterChange: (latlng: ILocationCoord) => void;
}

export const LocationPicker = ({
	id = "location-picker",
	className,
	mapPanZoom,
	showLocationPicker,
	mapRef,
	selectedLocationCoord,
	interactiveMapPinIconUrl = LocationPinBlue,
	onGetCurrentLocation,
	locationAvailable,
	gettingCurrentLocation,
	onMapCenterChange,
}: ILocationPickerProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
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

	/**
	 * Attach map and keep ref
	 */
	useEffect(() => {
		/**
		 * If component has mounted and is in map mode OR double panel (location panel is alway on for double panel)
		 */ if (leafletWrapperRef.current && showLocationPicker) {
			/**
			 * If there is not map set currently and show changed and should show, generate map
			 * Map is mounted on leafletWrapperRef
			 * Ref is attached to mapRef for controls
			 * Add marker to the map
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

			if (selectedLocationCoord?.lat && selectedLocationCoord?.lng) zoomWithMarkers(selectedLocationCoord);
		}
		return () => {
			mapRef.current?.off();
			mapRef.current?.remove();
			mapRef.current = undefined;
		};
	}, [showLocationPicker]);

	/**
	 * Whenever a map mounts, attach the listeners
	 */
	useEffect(() => {
		const map = mapRef.current;
		if (!showLocationPicker || !map) return;

		// To centre on the current location after it has been retrieved,
		// even if it didn't change, as it may have panned off-centre.
		if (!gettingCurrentLocation && selectedLocationCoord?.lat && selectedLocationCoord?.lng)
			zoomWithMarkers({ lat: selectedLocationCoord.lat, lng: selectedLocationCoord.lng });

		map.on("click", handleClickMap);

		const onZoomEnd = () => map.setMinZoom(mapPanZoom?.min ?? MIN_ZOOM_VALUE);
		map.on("zoomend", onZoomEnd);

		return () => {
			map.off("click", handleClickMap);
			map.off("zoomend", onZoomEnd);
		};
	}, [showLocationPicker, mapRef, gettingCurrentLocation]);

	/**
	 * Centre map to selected location from search result
	 */
	useEffect(() => {
		if (selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
			zoomWithMarkers(selectedLocationCoord);
		} else {
			resetView();
		}
	}, [selectedLocationCoord]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================

	const handleClickMap = ({ latlng }: L.LeafletMouseEvent) => {
		if (!gettingCurrentLocation) {
			zoomWithMarkers(latlng);
			onMapCenterChange(latlng);
		}
	};

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
		<LocationPickerWrapper className={className} id={TestHelper.generateId(id)}>
			<LeafletWrapper ref={leafletWrapperRef} />
			<ButtonLocation onClick={onGetCurrentLocation}>
				<ButtonLocationImage
					src={locationAvailable ? CurrentLocation : CurrentLocationUnavailable}
					alt={`Current location ${locationAvailable ? "available" : "unavailable"}`}
				/>
			</ButtonLocation>
		</LocationPickerWrapper>
	);
};
