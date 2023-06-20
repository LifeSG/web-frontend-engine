import { MediaWidths } from "@lifesg/react-design-system";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { TestHelper } from "../../../../../utils";
import { ILocationCoord } from "../../types";
import { markerFrom, removeMarkers } from "./helper";
import { CurrentLocation, CurrentLocationUnavailable, LocationPinBlue } from "./location-picker.data";
import { ButtonLocation, ButtonLocationImage, LeafletWrapper, LocationPickerWrapper } from "./location-picker.styles";
import { ILocationPickerProps } from "./types";

// Show picker when
// tablet: "map" mode
// desktop : always on "double" mode
// Hide when tablet: "search" mode
export const LocationPicker = ({
	id = "location-picker",
	className,
	mapPanZoom,
	panelInputMode,
	showLocationModal,
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
	const leafletConfig: L.MapOptions = {
		minZoom: 11,
		maxZoom: isMobile ? 20 : 19,
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * Attach map and keep ref
	 */
	useEffect(() => {
		/**
		 * If component has mounted and is in map mode OR double panel (location picker is alway on for double panel)
		 */
		if (leafletWrapperRef.current && showLocationModal) {
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
				maxNativeZoom: 18,
				maxZoom: isMobile ? 20 : 19,
				minZoom: leafletConfig.minZoom,
				// Do not remove this attribution
				attribution:
					'<div class="onemap"><img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a></div>',
			});

			mapRef.current.setMaxBounds([
				[1.56073, 104.1147],
				[1.16, 103.502],
			]);
			basemap.addTo(mapRef.current);

			// even if it didn't change, as it may have panned off-centre.
			// when toggling from search to map?
			if (!gettingCurrentLocation && selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
				// NOTE: map will zoom when input is cleared in search panelInputMode and switches to map panelInputMode
				zoomWithMarkers({ lat: selectedLocationCoord.lat, lng: selectedLocationCoord.lng });
			}
			const map = mapRef.current;

			// Reattach event listeners
			map.on("click", ({ latlng }: L.LeafletMouseEvent) => {
				if (!gettingCurrentLocation) {
					onMapCenterChange(latlng);
				}
			});

			map.on("zoomend", () => map.setMinZoom(mapPanZoom?.min ?? leafletConfig.minZoom));
		} else {
			if (mapRef.current) {
				mapRef.current?.off();
				mapRef.current?.remove();
				mapRef.current = undefined;
			}
		}
	}, [showLocationModal]);

	/**
	 * Centre map to selected location from search result
	 * Show the pan when we can see the map
	 */
	useEffect(() => {
		if (selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
			zoomWithMarkers(selectedLocationCoord);
		} else {
			resetView();
		}
	}, [selectedLocationCoord?.lat, selectedLocationCoord?.lng]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const resetView = () => {
		if (mapRef.current) {
			removeMarkers(markersRef.current);
			const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
			mapRef.current.setView([center.x, center.y], 12);
			setTimeout(() => mapRef.current?.invalidateSize(), 500);
		}
	};

	const zoomWithMarkers = (target: ILocationCoord) => {
		const map = mapRef.current;
		if (!map) return;
		removeMarkers(markersRef.current);

		markersRef.current = [markerFrom(target, interactiveMapPinIconUrl).addTo(map)];
		const panZoomValue = Math.max(
			mapPanZoom?.min ?? leafletConfig.minZoom,
			isMobile ? mapPanZoom?.mobile ?? 18 : mapPanZoom?.nonMobile ?? 17
		);

		const zoomValue =
			map.getBounds().contains([target.lat, target.lng]) && map.getZoom() > panZoomValue
				? map.getZoom()
				: panZoomValue;

		map.flyTo(L.latLng(target.lat, target.lng), zoomValue);
		setTimeout(() => map.invalidateSize(), 500);
	};

	return (
		<LocationPickerWrapper
			className={className}
			id={TestHelper.generateId(id, "location-picker")}
			data-testid={TestHelper.generateId(id, "location-picker", panelInputMode === "search" ? "hide" : "show")}
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
