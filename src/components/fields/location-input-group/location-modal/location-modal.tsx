import { MediaWidths, Modal } from "@lifesg/react-design-system";
import { Text } from "@lifesg/react-design-system/text";
import * as L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { GeoLocationHelper, TestHelper } from "../../../../utils";
import { ILocationInputValues, ILocationSearchProps, TPanelInputMode, TSetCurrentLocationDetail } from "../types";
import { ErrorImage, ModalBox, StyledLocationPicker } from "./location-modal.styles";
import { ILocationPickerProps } from "./location-picker";
import { LocationSearch } from "./location-search";
import NoNetworkModal from "./no-network-modal/no-network-modal";
import { PrefetchImage } from "./no-network-modal/no-network-modal.styles";
import { isEmpty } from "lodash";
import { useFieldEvent } from "../../../../utils/hooks";
import { Prompt } from "../../../shared";
import { Description } from "../../../shared/prompt/prompt.styles";
import { ILocationCoord, ONE_MAP_ERROR_NAME } from "../location-helper";

// FIXME
// use mol app assets once its fixed
// delete custom types once ported over
import ErrorSvg from "../../../../assets/common/error.svg";
import OfflineImage from "../../../../assets/common/no-network.png";
import TimeoutSvg from "../../../../assets/img/icons/get-location-timeout.svg";

interface HotlineContent {
	name: string;
	number: string;
}

export interface ILocationModalProps
	extends Pick<ILocationPickerProps, "mapPanZoom" | "interactiveMapPinIconUrl">,
		Pick<
			ILocationSearchProps,
			"reverseGeoCodeEndpoint" | "mustHavePostalCode" | "gettingCurrentLocationFetchMessage"
		> {
	id: string;
	showLocationModal: boolean;
	formValues?: ILocationInputValues | undefined;
	onClose: () => void;
	onConfirm: (values: ILocationInputValues) => void;
	locationPermissionErrorMessage?: string | undefined; // TODO ask weili if jsx allowed?
	hotlineContent?: HotlineContent | undefined;
	updateFormValues: (values: ILocationInputValues) => void;
	mastheadHeight?: number;
	disableErrorPromptOnApp?: boolean;
}

/**
 * Location modal screen variation
 * Mobile or tablet - single panel
 * Desktop - double panel
 */
const LocationModal = ({
	id = "location-modal",
	formValues, // modal, search, inputgroup
	showLocationModal, // modal, search, inputgroup
	disableErrorPromptOnApp, // modal, inputgroup
	mapPanZoom, // picker
	interactiveMapPinIconUrl, // picker
	reverseGeoCodeEndpoint, // search
	gettingCurrentLocationFetchMessage,
	locationPermissionErrorMessage, // modal
	hotlineContent, // modal, input group
	mustHavePostalCode, // modal, search
	mastheadHeight, // input group
	onClose,
	onConfirm,
	updateFormValues, // input, modal, input group
}: ILocationModalProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	// TODO remove this ref
	const mapRef = useRef<L.Map>();

	const [panelInputMode, setPanelInputMode] = useState<TPanelInputMode>("double");

	// Temporarily hold the selection
	// onConfirm we will save to state
	// if cancel, this value will need to be reset to form state value
	const [selectedAddressInfo, setSelectedAddressInfo] = useState<ILocationInputValues>({});

	const [locationAvailable, setLocationAvailable] = useState(true);

	const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
	const { dispatchFieldEvent } = useFieldEvent();

	const [hasInternetConnectivity, setHasInternetConnectivity] = useState(true);

	const [showGetLocationError, setShowGetLocationError] = useState(false);
	const [showOneMapError, setShowOneMapError] = useState(false);
	const [showGetLocationTimeoutError, setShowGetLocationTimeoutError] = useState(false);

	// map picked lat lng vs selectedAddressInfo
	// map picked value can be falsy/ no address found
	// selectedAddressInfo have valid addresses from one map
	const [mapPickedLatLng, setMapPickedLatLng] = useState<ILocationCoord>();

	// Show picker when
	// tablet: "map" mode
	// desktop : always on "double" mode
	// Hide when tablet: "search" mode
	const showLocationPicker = showLocationModal && (panelInputMode === "double" || panelInputMode === "map");

	// =============================================================================
	// EFFECTS
	// =============================================================================
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
		if (!showLocationModal) return;
		/**
		 * We should only getCurrentLocation when nothing is prefilled
		 * when formvalues are prefilled, the useEffect will recenter
		 * the location for us
		 *
		 * This is meant for first entry
		 */
		if (!formValues?.lat && !formValues?.lng) {
			getCurrentLocation();
		}
	}, [showLocationModal]);

	/**
	 * triggers when
	 * - selecting search result
	 * - prefill
	 */
	useEffect(() => {
		if (!isEmpty(selectedAddressInfo) && panelInputMode === "search") {
			setSinglePanelMode("map");
		}
	}, [selectedAddressInfo, gettingCurrentLocation]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleCloseLocationModal = () => {
		mapRef.current?.off();
		mapRef.current?.remove();
		mapRef.current = undefined;
		onClose();
	};

	const handleGetLocationCallback = () => {
		setGettingCurrentLocation(false);
		setLocationAvailable(true);
	};

	const handleGetLocationError = (error?: any) => {
		setGettingCurrentLocation(false);
		setLocationAvailable(false);

		// TODO: dispatch
		// EVENT
		if (isLifeSgApp() && !!disableErrorPromptOnApp) {
			setShowGetLocationTimeoutError(false);
			return;
		}

		if (
			!isLifeSgApp() &&
			!!error["GeolocationPositionError"] &&
			Number.parseInt(error["GeolocationPositionError"]?.code) === global.GeolocationPositionError.TIMEOUT
		) {
			setShowGetLocationTimeoutError(true);
			return;
		}

		setShowGetLocationError(true);
	};

	const handleApiErrors = (error?: any) => {
		setGettingCurrentLocation(false);

		if (error?.message === ONE_MAP_ERROR_NAME) {
			restoreFormvalues();
			setShowOneMapError(true);
			return;
		}

		setLocationAvailable(false);

		if (isLifeSgApp() && !!disableErrorPromptOnApp) {
			setShowGetLocationTimeoutError(false);
			return;
		}

		// try with typeof
		if (
			!isLifeSgApp() &&
			!!error["GeolocationPositionError"] &&
			Number.parseInt(error["GeolocationPositionError"]?.code) === global.GeolocationPositionError.TIMEOUT
		) {
			setShowGetLocationTimeoutError(true);
			return;
		}

		setShowGetLocationError(true);
	};

	const handleCancel = () => {
		restoreFormvalues();
		handleCloseLocationModal();
	};

	const handleConfirm = () => {
		onConfirm(selectedAddressInfo);
		handleCloseLocationModal();
	};

	const handleCloseLocationPermissionModal = () => {
		setShowGetLocationError(false);
	};

	const handleMapClick = (latlng: ILocationCoord) => {
		setMapPickedLatLng(latlng);
	};

	const handleOneMapError = () => {
		restoreFormvalues();
		setShowOneMapError(true);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const setSinglePanelMode = (inputMode: TPanelInputMode) => {
		if (panelInputMode === "double") return;
		setPanelInputMode(inputMode);
	};

	// REMOVE
	const isLifeSgApp = (): boolean => {
		return typeof window !== "undefined" && window.sessionStorage.getItem("lifeSg") === "true";
	};

	/**
	 * getCurrentLocation is to trigger the child components to carry their specific tasks
	 * no actual work is to be done here
	 */
	const getCurrentLocation = async () => {
		setGettingCurrentLocation(true);

		// TODO add documentation for how to cancel events and handle default
		// should debounce?
		const shouldPreventDefault = !dispatchFieldEvent("get-current-location", id);

		if (!shouldPreventDefault) {
			const detail: TSetCurrentLocationDetail = {};

			try {
				detail["payload"] = await GeoLocationHelper.getCurrentLocation();
			} catch (error) {
				detail["errors"] = {
					getCurrentLocation: error,
				};
			}

			dispatchFieldEvent<TSetCurrentLocationDetail>("set-current-location", id, detail);
		}
	};

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

	const restoreFormvalues = () => {
		// Retain current form values
		setSelectedAddressInfo(formValues || {});
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderUnableToSubmitReport = (): JSX.Element => {
		return (
			<>
				<br />
				<br />
				Do note that you&rsquo;ll not be able to submit your report without entering the location.
			</>
		);
	};

	const renderHotlineDetails = ({ name, number }: HotlineContent): JSX.Element => {
		return (
			<>
				<br />
				<br />
				Alternatively, you can call the&nbsp;
				<Text.Body inline weight="semibold">
					{name} hotline&nbsp;
				</Text.Body>
				at&nbsp;
				<Text.Hyperlink.Default weight="semibold" href={`tel:${number}`}>
					{number}
				</Text.Hyperlink.Default>
				.
			</>
		);
	};

	// FIXME use testhelper id
	const renderNetworkErrorPrompt = () => {
		/**
		 * Do not render any other error if there is no internet connectivity
		 * since the form is not interactive.
		 * When network restored, the form value will used.
		 */
		if (!hasInternetConnectivity || !showLocationModal) return;

		/**
		 * Should I render all prompts and use the show prop to decide which to render?
		 */
		if (showOneMapError) {
			return (
				<Prompt
					id={TestHelper.generateId(id, "onemap-error")}
					data-testid={TestHelper.generateId(id, "onemap-error")}
					title="Map not available"
					size="large"
					show={true}
					image={<ErrorImage src={ErrorSvg} />}
					description={
						<Description weight="regular">
							Sorry, there was a problem with the map. You&rsquo;ll not be able to enter the location
							right now. Please try again later.
							{hotlineContent ? renderHotlineDetails(hotlineContent) : renderUnableToSubmitReport()}
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
						locationPermissionErrorMessage ??
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
					image={<ErrorImage src={TimeoutSvg} />}
					description={
						<Description weight="regular">
							It&rsquo;s taking longer than expected to retrieve your location. Please exit the map and
							try again.
							{hotlineContent && renderHotlineDetails(hotlineContent)}
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
			<PrefetchImage src={OfflineImage} alt="no internet connectivity" />
			<Modal
				id={TestHelper.generateId(id, "modal", showLocationModal ? "show" : "hide")}
				show={showLocationModal}
			>
				<ModalBox id={TestHelper.generateId(id, "box")} showCloseButton={false} mastheadHeight={mastheadHeight}>
					{hasInternetConnectivity ? (
						<>
							<LocationSearch
								id={id}
								onCancel={handleCancel}
								onConfirm={handleConfirm}
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
								gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
								mustHavePostalCode={mustHavePostalCode}
							/>
							<StyledLocationPicker
								id={id}
								panelInputMode={panelInputMode}
								locationAvailable={locationAvailable}
								gettingCurrentLocation={gettingCurrentLocation}
								showLocationPicker={showLocationPicker}
								selectedLocationCoord={{
									lat: selectedAddressInfo.lat,
									lng: selectedAddressInfo.lng,
								}}
								mapRef={mapRef}
								getCurrentLocation={getCurrentLocation}
								onMapCenterChange={handleMapClick}
								interactiveMapPinIconUrl={interactiveMapPinIconUrl}
								mapPanZoom={mapPanZoom}
							/>
						</>
					) : (
						<NoNetworkModal id={id} cachedImage={OfflineImage} refreshNetwork={refreshNetwork} />
					)}
				</ModalBox>
			</Modal>
			{renderNetworkErrorPrompt()}
		</>
	);
};

export default LocationModal;
