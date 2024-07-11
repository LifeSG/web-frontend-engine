import { MediaWidths, Modal } from "@lifesg/react-design-system";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { OneMapError } from "../../../../services/onemap/types";
import { GeoLocationHelper, TestHelper } from "../../../../utils";
import { useFieldEvent } from "../../../../utils/hooks";
import { Prompt } from "../../../shared";
import { Description } from "../../../shared/prompt/prompt.styles";
import {
	GeolocationPositionErrorWrapper,
	ILocationCoord,
	ILocationFieldValues,
	TErrorType,
	TLocationFieldErrorDetail,
	TLocationFieldEvents,
	TPanelInputMode,
	TSetCurrentLocationDetail,
} from "../types";
import { ERROR_SVG, OFFLINE_IMAGE, TIMEOUT_SVG } from "./location-modal.data";
import { ErrorImage, ModalBox, PrefetchImage, StyledLocationPicker } from "./location-modal.styles";
import { IMapPin } from "./location-picker/types";
import { LocationSearch } from "./location-search";
import NoNetworkModal from "./no-network-modal/no-network-modal";
import { ILocationModalProps } from "./types";

/**
 * Location modal screen variation
 * Mobile or tablet - single panel
 * Desktop - double panel
 */
const LocationModal = ({
	id = "location-modal",
	className,
	formValues,
	showLocationModal,
	mapPanZoom,
	interactiveMapPinIconUrl,
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	gettingCurrentLocationFetchMessage,
	mapBannerText,
	mustHavePostalCode,
	locationModalStyles,
	onClose,
	onConfirm,
	updateFormValues,
	locationListTitle,
	locationSelectionMode,
	disableSearch,
	addressFieldPlaceholder,
	searchBarIcon,
}: ILocationModalProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const [panelInputMode, setPanelInputMode] = useState<TPanelInputMode>("double");

	// Temporarily hold the selection
	// onConfirm we will save to state
	// if cancel, this value will need to be reset to form state value
	const [selectedAddressInfo, setSelectedAddressInfo] = useState<ILocationFieldValues>({});
	const [selectablePins, setSelectablePins] = useState<IMapPin[]>([]);

	const [locationAvailable, setLocationAvailable] = useState(true);

	const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
	const { dispatchFieldEvent, addFieldEventListener, removeFieldEventListener } = useFieldEvent();

	const [hasInternetConnectivity, setHasInternetConnectivity] = useState(true);
	const [showGetLocationError, setShowGetLocationError] = useState(false);
	const [showOneMapError, setShowOneMapError] = useState(false);
	const [showGetLocationTimeoutError, setShowGetLocationTimeoutError] = useState(false);

	// map picked lat lng vs selectedAddressInfo
	// map picked value can be falsy/ no address found
	// selectedAddressInfo have valid addresses from one map
	const [mapPickedLatLng, setMapPickedLatLng] = useState<ILocationCoord>();

	const shouldCallGetSelectablePins = useRef(true);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const setSinglePanelMode = useCallback((inputMode: TPanelInputMode, onlyHandleIfStateIs?: TPanelInputMode) => {
		setPanelInputMode((prev) => {
			if (prev === "double" || (!!onlyHandleIfStateIs && prev !== onlyHandleIfStateIs)) {
				return prev;
			}

			return inputMode;
		});
	}, []);

	const getCurrentLocation = useCallback(async () => {
		setGettingCurrentLocation(true);

		// TODO add documentation for how to cancel events and handle default
		const shouldPreventDefault = !dispatchFieldEvent("get-current-location", id);

		if (!shouldPreventDefault) {
			const detail: TSetCurrentLocationDetail = {};

			try {
				detail.payload = await GeoLocationHelper.getCurrentLocation();
			} catch (error) {
				detail.errors = error;
			}

			dispatchFieldEvent<TSetCurrentLocationDetail>("set-current-location", id, detail);
			return detail.payload;
		}
	}, [dispatchFieldEvent, id]);

	// Manually refresh network if auto refresh has any issue
	const refreshNetwork = () => {
		try {
			if (navigator.onLine) {
				setHasInternetConnectivity(true);
			}
		} catch (error) {
			// silent error
		}
	};

	const restoreFormvalues = useCallback(() => {
		// Retain current form values
		setSelectedAddressInfo(formValues || {});
	}, [formValues]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleCloseLocationModal = useCallback(() => {
		shouldCallGetSelectablePins.current = true;
		onClose();
	}, [onClose]);

	const handleGetLocationCallback = () => {
		setGettingCurrentLocation(false);
		setLocationAvailable(true);
	};

	const handleApiErrors = (error?: any) => {
		const handleError = (errorType: TErrorType["errorType"], defaultHandle: () => void) => {
			const shouldPreventDefault = !dispatchFieldEvent<TLocationFieldErrorDetail>("error", id, {
				payload: {
					errorType,
				},
				errors: error,
			});

			if (shouldPreventDefault) return;
			defaultHandle();
		};

		setGettingCurrentLocation(false);

		if (error instanceof OneMapError) {
			handleError("OneMapError", () => {
				restoreFormvalues();
				setShowOneMapError(true);
			});

			return;
		}

		setLocationAvailable(false);

		if (
			error instanceof GeolocationPositionErrorWrapper &&
			error?.code?.toString() === GeolocationPositionError.TIMEOUT.toString()
		) {
			handleError("GetLocationTimeoutError", () => {
				setShowGetLocationTimeoutError(true);
			});
			return;
		}

		handleError("GetLocationError", () => {
			setShowGetLocationError(true);
		});
	};

	const handleCancel = useCallback(() => {
		restoreFormvalues();
		handleCloseLocationModal();
	}, [handleCloseLocationModal, restoreFormvalues]);

	const handleClickConfirm = () => {
		const shouldPreventDefault = !dispatchFieldEvent("click-confirm-location", id, selectedAddressInfo);
		if (!shouldPreventDefault) {
			handleConfirm();
		}
	};

	const handleConfirm = useCallback(
		(e?: CustomEvent | undefined) => {
			const addressInfo = !isEmpty(e?.detail) ? e?.detail : selectedAddressInfo;
			onConfirm(addressInfo);
			handleCloseLocationModal();
		},
		[handleCloseLocationModal, onConfirm, selectedAddressInfo]
	);

	const handleCloseLocationPermissionModal = () => {
		const shouldPreventDefault = !dispatchFieldEvent("before-hide-permission-modal", id);
		if (!shouldPreventDefault) {
			setShowGetLocationError(false);
		}
	};

	const handleMapClick = (latlng: ILocationCoord) => {
		setMapPickedLatLng(latlng);
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const handleError = (e: TLocationFieldEvents["error-end"]) => {
			const errorType = e.detail?.payload?.errorType;
			if (!errorType) return;

			switch (errorType) {
				case "OneMapError":
				case "GetLocationTimeoutError":
					handleCloseLocationModal();
					break;
				case "GetLocationError":
				case "PostalCodeError":
				default:
					break;
			}
		};

		const handleHidePermissionModal = () => {
			setShowGetLocationError(false);
		};

		const handleSetSelectablePins = (e: TLocationFieldEvents["set-selectable-pins"]) => {
			const pinsArray = e.detail.pins;
			if (!Array.isArray(pinsArray)) {
				setShowOneMapError(true);
				return;
			}
			setSelectablePins(pinsArray);
		};

		const eventsData = {
			["error-end"]: handleError,
			["set-selectable-pins"]: handleSetSelectablePins,
			["confirm-location"]: handleConfirm,
			["hide-permission-modal"]: handleHidePermissionModal,
			["dismiss-location-modal"]: handleCancel,
			["trigger-get-current-location"]: getCurrentLocation,
		};

		Object.entries(eventsData).forEach(([event, callback]) => {
			addFieldEventListener(event, id, callback);
		});

		return () => {
			Object.entries(eventsData).forEach(([event, callback]) => {
				removeFieldEventListener(event, id, callback);
			});
		};
	}, [
		addFieldEventListener,
		getCurrentLocation,
		handleCancel,
		handleCloseLocationModal,
		handleConfirm,
		id,
		removeFieldEventListener,
	]);

	useEffect(() => {
		if (!window) return;

		const mql = matchMedia(`(max-width: ${MediaWidths.tablet}px)`);
		setPanelInputMode(mql.matches ? "map" : "double");

		const handleHasInternetConnectivity = () => setHasInternetConnectivity(true);
		const handleNoInternetConnectivity = () => setHasInternetConnectivity(false);
		// TODO handle when there is querystring
		const handleResize = (e: MediaQueryListEvent) => {
			setPanelInputMode(e.matches ? "map" : "double");
		};

		window.addEventListener("online", handleHasInternetConnectivity);
		window.addEventListener("offline", handleNoInternetConnectivity);
		mql.addEventListener("change", handleResize);

		return () => {
			window.removeEventListener("online", handleHasInternetConnectivity);
			window.removeEventListener("offline", handleNoInternetConnectivity);
			mql.removeEventListener("change", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!showLocationModal) {
			// Reset to map when one single panel view
			setPanelInputMode((prev) => (prev !== "double" ? "map" : prev));
			return;
		}

		const recenterAndTriggerEvent = async () => {
			/**
			 * We should only getCurrentLocation when nothing is prefilled
			 * when formvalues are prefilled, the useEffect will recenter
			 * the location for us
			 *
			 * This is meant for first entry
			 */
			const { lat, lng } = formValues || {};
			if (!lat && !lng) {
				await getCurrentLocation();
			} else if (shouldCallGetSelectablePins.current) {
				dispatchFieldEvent<ILocationCoord>("get-selectable-pins", id, {
					lat: lat,
					lng: lng,
				});
			}
			shouldCallGetSelectablePins.current = false;
		};
		recenterAndTriggerEvent();
	}, [dispatchFieldEvent, formValues, getCurrentLocation, id, showLocationModal]);

	/**
	 * triggers when
	 * - selecting search result
	 * - prefill
	 */
	useEffect(() => {
		if (!isEmpty(selectedAddressInfo)) {
			setSinglePanelMode("map", "search");
		}
	}, [selectedAddressInfo, gettingCurrentLocation, setSinglePanelMode]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderNetworkErrorPrompt = () => {
		/**
		 * Do not render any other error if there is no internet connectivity
		 * since the form is not interactive.
		 * When network restored, the form value will used.
		 */
		if (!hasInternetConnectivity || !showLocationModal) return;

		if (showOneMapError) {
			return (
				<Prompt
					id={TestHelper.generateId(id, "onemap-error")}
					data-testid={TestHelper.generateId(id, "onemap-error")}
					title="Map not available"
					size="large"
					show={true}
					image={<ErrorImage src={ERROR_SVG} />}
					description={
						<Description weight="regular">
							Sorry, there was a problem with the map. You&rsquo;ll not be able to enter the location
							right now. Please try again later.
							<br />
							<br />
							Do note that you&rsquo;ll not be able to submit your report without entering the location.
						</Description>
					}
					buttons={[
						{
							id: "ok",
							title: "OK",
							onClick: () => {
								setShowOneMapError(false);
								handleCloseLocationModal();
							},
						},
					]}
				/>
			);
		}

		if (showGetLocationError) {
			return (
				<Prompt
					id={TestHelper.generateId(id, "get-location-error")}
					data-testid={TestHelper.generateId(id, "get-location-error")}
					title="Enable location settings"
					size="large"
					show={true}
					description={
						"We need your permission to determine your location. Enable location access in your browser and device settings, or enter your location manually."
					}
					buttons={[
						{
							id: "ok",
							title: "OK",
							onClick: handleCloseLocationPermissionModal,
						},
					]}
				/>
			);
		}

		if (showGetLocationTimeoutError) {
			return (
				<Prompt
					id={TestHelper.generateId(id, "get-location-timeout-error")}
					data-testid={TestHelper.generateId(id, "get-location-timeout-error")}
					title="Something went wrong"
					size="large"
					show={true}
					image={<ErrorImage src={TIMEOUT_SVG} />}
					description={
						<Description weight="regular">
							It&rsquo;s taking longer than expected to retrieve your location. Please exit the map and
							try again.
						</Description>
					}
					buttons={[
						{
							id: "ok",
							title: "OK",
							onClick: () => {
								setShowGetLocationTimeoutError(false);
								handleCloseLocationModal();
							},
						},
					]}
				/>
			);
		}
	};

	return (
		<>
			<PrefetchImage src={OFFLINE_IMAGE} alt="no internet connectivity" />
			<Modal
				id={TestHelper.generateId(id, "modal", showLocationModal ? "show" : "hide")}
				className={`${className}-location-modal`}
				show={showLocationModal}
			>
				<ModalBox
					id={TestHelper.generateId(id, "modal-box")}
					className={`${className}-modal-box`}
					showCloseButton={false}
					locationModalStyles={locationModalStyles}
				>
					{hasInternetConnectivity ? (
						<>
							<LocationSearch
								id={id}
								className={className}
								onCancel={handleCancel}
								onConfirm={handleClickConfirm}
								updateFormValues={updateFormValues}
								gettingCurrentLocation={gettingCurrentLocation}
								panelInputMode={panelInputMode}
								selectedAddressInfo={selectedAddressInfo}
								mapPickedLatLng={mapPickedLatLng}
								formValues={formValues}
								onChangeSelectedAddressInfo={setSelectedAddressInfo}
								handleApiErrors={handleApiErrors}
								onGetLocationCallback={handleGetLocationCallback}
								setSinglePanelMode={setSinglePanelMode}
								showLocationModal={showLocationModal}
								reverseGeoCodeEndpoint={reverseGeoCodeEndpoint}
								convertLatLngToXYEndpoint={convertLatLngToXYEndpoint}
								gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
								mustHavePostalCode={mustHavePostalCode}
								locationListTitle={locationListTitle}
								restrictLocationSelection={locationSelectionMode === "pins-only"}
								selectablePins={selectablePins}
								disableSearch={disableSearch}
								addressFieldPlaceholder={addressFieldPlaceholder}
								searchBarIcon={searchBarIcon}
							/>
							<StyledLocationPicker
								id={id}
								className={className}
								panelInputMode={panelInputMode}
								locationAvailable={locationAvailable}
								gettingCurrentLocation={gettingCurrentLocation}
								showLocationModal={showLocationModal}
								selectedLocationCoord={{
									lat: selectedAddressInfo.lat,
									lng: selectedAddressInfo.lng,
								}}
								getCurrentLocation={getCurrentLocation}
								onMapCenterChange={handleMapClick}
								interactiveMapPinIconUrl={interactiveMapPinIconUrl}
								mapPanZoom={mapPanZoom}
								mapBannerText={mapBannerText}
								disableSelectionFromMap={locationSelectionMode === "pins-only"}
								disableCurrLocationMarker={locationSelectionMode === "pins-only"}
								selectablePins={selectablePins}
							/>
						</>
					) : (
						<NoNetworkModal id={id} cachedImage={OFFLINE_IMAGE} refreshNetwork={refreshNetwork} />
					)}
				</ModalBox>
			</Modal>
			{renderNetworkErrorPrompt()}
		</>
	);
};

export default LocationModal;
