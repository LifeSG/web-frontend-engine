import { Modal } from "@lifesg/react-design-system/modal";
import {
	Breakpoint,
	useMaxWidthMediaQuery,
	useMediaQuery,
	useResolvedBreakpointToken,
} from "@lifesg/react-design-system/theme";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { OneMapError } from "../../../../services/onemap/types";
import { GeoLocationHelper, TestHelper } from "../../../../utils";
import { useFieldEvent } from "../../../../utils/hooks";
import { Prompt } from "../../../shared";
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
import { Typography } from "@lifesg/react-design-system/typography";
import { ERROR_SVG, OFFLINE_IMAGE, TIMEOUT_SVG } from "./location-modal.data";
import * as styles from "./location-modal.styles";
import { IMapPin } from "./location-picker/types";
import { LocationPicker } from "./location-picker";
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
	mapApi,
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
	bufferRadius,
	pinsOnlyIndicateCurrentLocation,
	legendItems,
	defaultAddress,
}: ILocationModalProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const isMobileOrTablet = useMaxWidthMediaQuery("lg");
	const smMaxToken = useResolvedBreakpointToken(Breakpoint["sm-max"]);
	const isMobileLandscape = useMediaQuery({
		clauses: [
			{ feature: "orientation", value: "landscape" },
			{ feature: "max-height", value: smMaxToken },
		],
	});
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
	const [currentLocation, setCurrentLocation] = useState<ILocationCoord>();

	const isMounted = useRef(true);
	const shouldCallGetSelectablePins = useRef(true);
	const modalBoxRef = useRef<HTMLDivElement>(null);

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
		if (!isMounted.current) return;

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

	const handleGetLocationCallback = (lat: number, lng: number) => {
		setGettingCurrentLocation(false);
		setLocationAvailable(true);
		setCurrentLocation({ lat, lng });
	};

	const handleApiErrors = (error?: any) => {
		if (!isMounted.current) return;

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
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (modalBoxRef.current && locationModalStyles) {
			modalBoxRef.current.style.cssText += locationModalStyles;
		}
	}, [locationModalStyles]);

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
		setPanelInputMode(isMobileOrTablet ? "map" : "double");
	}, [isMobileOrTablet]);

	useEffect(() => {
		const handleHasInternetConnectivity = () => setHasInternetConnectivity(true);
		const handleNoInternetConnectivity = () => setHasInternetConnectivity(false);
		// TODO handle when there is querystring

		window.addEventListener("online", handleHasInternetConnectivity);
		window.addEventListener("offline", handleNoInternetConnectivity);

		return () => {
			window.removeEventListener("online", handleHasInternetConnectivity);
			window.removeEventListener("offline", handleNoInternetConnectivity);
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

	useEffect(() => {
		setSelectedAddressInfo(formValues || {});
	}, [formValues]);

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
					image={<img className={styles.errorImage} src={ERROR_SVG} alt="Map error" />}
					description={
						<Typography.HeadingXS className={styles.description} weight="regular">
							Sorry, there was a problem with the map. You&rsquo;ll not be able to enter the location
							right now. Please try again later.
							<br />
							<br />
							Do note that you&rsquo;ll not be able to submit your report without entering the location.
						</Typography.HeadingXS>
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
					image={<img className={styles.errorImage} src={TIMEOUT_SVG} alt="Timeout error" />}
					description={
						<Typography.HeadingXS className={styles.description} weight="regular">
							It&rsquo;s taking longer than expected to retrieve your location. Please exit the map and
							try again.
						</Typography.HeadingXS>
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
			<img className={styles.prefetchImage} src={OFFLINE_IMAGE} alt="no internet connectivity" />
			<Modal
				id={TestHelper.generateId(id, "modal", showLocationModal ? "show" : "hide")}
				className={`${className}-location-modal`}
				show={showLocationModal}
			>
				<Modal.Box
					ref={modalBoxRef}
					id={TestHelper.generateId(id, "modal-box")}
					className={clsx(styles.modalBox, `${className}-modal-box`)}
					showCloseButton={false}
					data-mobile-landscape={!!isMobileLandscape}
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
								mapApi={mapApi}
								gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
								mustHavePostalCode={mustHavePostalCode}
								locationListTitle={locationListTitle}
								restrictLocationSelection={locationSelectionMode === "pins-only"}
								selectablePins={selectablePins}
								disableSearch={disableSearch}
								addressFieldPlaceholder={addressFieldPlaceholder}
								searchBarIcon={searchBarIcon}
								bufferRadius={bufferRadius}
							/>
							<LocationPicker
								id={id}
								className={clsx(styles.styledLocationPicker, className)}
								data-panel-mode={panelInputMode}
								panelInputMode={panelInputMode}
								locationAvailable={locationAvailable}
								gettingCurrentLocation={gettingCurrentLocation}
								showLocationModal={showLocationModal}
								legendItems={legendItems}
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
								disableSelectedLocationMarker={locationSelectionMode === "pins-only"}
								selectablePins={selectablePins}
								pinsOnlyIndicateCurrentLocation={
									pinsOnlyIndicateCurrentLocation && locationSelectionMode === "pins-only"
								}
								currentLocation={currentLocation}
								defaultAddress={defaultAddress}
							/>
						</>
					) : (
						<NoNetworkModal id={id} cachedImage={OFFLINE_IMAGE} refreshNetwork={refreshNetwork} />
					)}
				</Modal.Box>
			</Modal>
			{renderNetworkErrorPrompt()}
		</>
	);
};

export default LocationModal;
