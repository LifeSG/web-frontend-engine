import { Breakpoint, Colour } from "@lifesg/react-design-system";
import { Typography } from "@lifesg/react-design-system/typography";
import { NavigationIcon } from "@lifesg/react-icons/navigation";
import { NavigationFillIcon } from "@lifesg/react-icons/navigation-fill";
import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { useTheme } from "styled-components";
import { TestHelper } from "../../../../../utils";
import { useFieldEvent } from "../../../../../utils/hooks";
import { LocationHelper } from "../../location-helper";
import { ILocationCoord } from "../../types";
import { markerFrom, removeMarkers } from "./helper";
import {
	Banner,
	BannerWrapper,
	ButtonLocation,
	ButtonLocationImage,
	LeafletWrapper,
	LocationPickerWrapper,
} from "./location-picker.styles";
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
	interactiveMapPinIconUrl,
	getCurrentLocation,
	locationAvailable,
	gettingCurrentLocation,
	onMapCenterChange,
	mapBannerText,
	disableSelectionFromMap,
	disableCurrLocationMarker,
	selectablePins,
}: ILocationPickerProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const theme = useTheme();
	const mapRef = useRef<L.Map>();

	const leafletWrapperRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<L.Marker[]>();
	const isMobile = window.matchMedia(`(max-width: ${Breakpoint["lg-max"]({ theme })}px)`).matches;
	const leafletConfig: L.MapOptions = {
		minZoom: 11,
		maxZoom: isMobile ? 20 : 19,
	};

	const { dispatchFieldEvent } = useFieldEvent();

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
			const basemap = L.tileLayer("https://www.onemap.gov.sg/maps/tiles/Default_HD/{z}/{x}/{y}.png", {
				detectRetina: true,
				maxNativeZoom: 18,
				maxZoom: mapPanZoom?.max ?? (isMobile ? 20 : 19),
				minZoom: leafletConfig.minZoom,
				// Do not remove this attribution
				attribution:
					'<div class="onemap"><img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a></div>',
			});

			const [ne, sw] = LocationHelper.getMapBounds();
			mapRef.current.setMaxBounds(L.latLngBounds(L.latLng(ne), L.latLng(sw)));
			basemap.addTo(mapRef.current);

			// even if it didn't change, as it may have panned off-centre.
			if (!gettingCurrentLocation && selectedLocationCoord?.lat && selectedLocationCoord?.lng) {
				// NOTE: map will zoom when input is cleared in search panelInputMode and switches to map panelInputMode
				zoomWithMarkers([{ lat: selectedLocationCoord.lat, lng: selectedLocationCoord.lng }]);
			}
			const map = mapRef.current;

			// Reattach event listeners
			map.on("click", ({ latlng }: L.LeafletMouseEvent) => {
				if (!disableSelectionFromMap && !gettingCurrentLocation) {
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
		if (!selectedLocationCoord?.lat || !selectedLocationCoord?.lng) {
			resetView();
			return;
		}

		if (selectablePins.length) {
			const pins = [...selectablePins];
			if (!disableCurrLocationMarker) {
				pins.push(selectedLocationCoord);
			}
			zoomWithMarkers(pins, true, selectedLocationCoord, true, true);
		} else {
			zoomWithMarkers([selectedLocationCoord], !disableCurrLocationMarker);
		}
	}, [selectedLocationCoord?.lat, selectedLocationCoord?.lng, selectablePins]);

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

	const zoomWithMarkers = (
		targets: ILocationCoord[],
		shouldSetMarkers = true,
		_zoomCenter?: ILocationCoord,
		selectableMarkers = false,
		enlargeSelectedMarker = false
	) => {
		const map = mapRef.current;
		if (!map) return;
		removeMarkers(markersRef.current);

		if (shouldSetMarkers) {
			markersRef.current = getMarkers(map, targets, selectableMarkers, enlargeSelectedMarker);
		}

		zoomAndCenter(map, _zoomCenter || targets[0]);
	};

	const getMarkers = (
		map: L.Map,
		targets: ILocationCoord[],
		shouldSelectOnClick: boolean,
		enlargeSelectedMarker: boolean
	) =>
		targets.map((target) => {
			const isSelected = enlargeSelectedMarker
				? target.lat === selectedLocationCoord.lat && target.lng === selectedLocationCoord.lng
				: undefined;
			const mapPinIcon =
				"data:image/svg+xml;base64," +
				btoa(ReactDOMServer.renderToString(<PinFillIcon color={Colour.icon({ theme: theme })} />));
			const marker = markerFrom(target, interactiveMapPinIconUrl ?? mapPinIcon, isSelected).addTo(map);

			return shouldSelectOnClick
				? marker.on("click", () => {
						// To accurately identify the pin, use the original lat & lng from the pin
						// instead of the ones from the LeafletMouseEvent.
						zoomAndCenter(map, { lat: target.lat, lng: target.lng });
						onMapCenterChange({
							lat: target.lat,
							lng: target.lng,
						});
				  })
				: marker;
		});

	const zoomAndCenter = (map: L.Map, zoomCenter: ILocationCoord) => {
		const panZoomValue = Math.max(
			mapPanZoom?.min ?? leafletConfig.minZoom,
			isMobile ? mapPanZoom?.mobile ?? 18 : mapPanZoom?.nonMobile ?? 17
		);

		const zoomValue =
			map.getBounds().contains([zoomCenter.lat, zoomCenter.lng]) && map.getZoom() > panZoomValue
				? map.getZoom()
				: panZoomValue;

		map.flyTo(L.latLng(zoomCenter.lat, zoomCenter.lng), zoomValue);
		setTimeout(() => map.invalidateSize(), 500);
	};

	return (
		<LocationPickerWrapper
			className={`${className}-location-picker`}
			id={TestHelper.generateId(id, "location-picker")}
			data-testid={TestHelper.generateId(id, "location-picker", panelInputMode === "search" ? "hide" : "show")}
		>
			{mapBannerText && (
				<BannerWrapper data-testid={TestHelper.generateId(id, "location-banner")}>
					<Banner>
						<Typography.BodyXS>{mapBannerText}</Typography.BodyXS>
					</Banner>
				</BannerWrapper>
			)}
			<LeafletWrapper ref={leafletWrapperRef} />
			<ButtonLocation
				data-testid={TestHelper.generateId(id, "refresh-current-location-button")}
				onClick={() => {
					if (locationAvailable) {
						const shouldPreventDefault = !dispatchFieldEvent("click-refresh-current-location", id);
						if (!shouldPreventDefault) {
							getCurrentLocation();
						}
					}
				}}
			>
				<ButtonLocationImage>
					{locationAvailable ? <NavigationFillIcon /> : <NavigationIcon />}
				</ButtonLocationImage>
			</ButtonLocation>
		</LocationPickerWrapper>
	);
};
