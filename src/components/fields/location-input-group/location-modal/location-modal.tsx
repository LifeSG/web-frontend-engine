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
import { ILocationCoord } from "../location-helper";

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
			| "reverseGeoCodeEndpoint"
			| "disableErrorPromptOnApp"
			| "mustHavePostalCode"
			| "gettingCurrentLocationFetchMessage"
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
	disableErrorPromptOnApp, // modal, search, inputgroup
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
	const mapRef = useRef<L.Map>();

	const [panelInputMode, setPanelInputMode] = useState<TPanelInputMode>("double");

	// Temporarily hold the selection
	// onConfirm we will save to state
	// if cancel, this value will need to be reset to form state value
	const [selectedAddressInfo, setSelectedAddressInfo] = useState<ILocationInputValues>({});

	const [locationAvailable, setLocationAvailable] = useState(true);
	// FIXME can this be replaced with events logic?
	const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
	const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = useFieldEvent();

	const [hasInternetConnectivity, setHasInternetConnectivity] = useState(true);
	const [showGetLocationError, setShowGetLocationError] = useState(false);
	const [showOneMapError, setShowOneMapError] = useState(false);
	const [showGetLocationTimeoutError, setShowGetLocationTimeoutError] = useState(false);

	const [mapPickedLatLng, setMapPickedLatLng] = useState<ILocationCoord>();
	// const [didUserClickMap, setDidUserClickMap] = useState<boolean>(false);
	// Show the location picker if:
	// 1) Location modal should be shown (show === true), AND
	// 2) Screen width > MediaWidths.tablet (dual-panel modal)
	//    OR screen width <= MediaWidths.tablet (single-panel modal) and mobileMode === "map"
	//    (mobileMode === "map" means the map is shown,
	//     mobileMode === "search" means the search results are shown instead of the map)
	const showLocationPicker = showLocationModal && (panelInputMode === "double" || panelInputMode === "map");

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * Network connectivity
	 * Resize affects panels
	 */
	useEffect(() => {
		if (!window) return;
		/**
		 * There are two instances where permissions can be checked
		 * - checking on the permissions api
		 * - getting value/ error when using the getCurrentLocation function
		 */

		// FIXME this is not working as intended (defer this?)
		if (!isLifeSgApp() && !("geolocation" in navigator)) {
			// Geolocation is not supported by this browser
			setLocationAvailable(false);
		}
		// else {

		// navigator.permissions.query({ name: "geolocation" }).then((result) => {
		// 	setLocationAvailable(result.state === "granted");
		// 	setShowGetLocationError(!isLifeSgApp() || !!disableErrorPromptOnApp);
		// 	/**
		// 	 * Safari onchange for permissions change will not trigger
		// 	 * the only impact is the retrieve current location icon will not change icon type
		// 	 * dont set error since the modal should only be shown on first load
		// 	 */
		// 	result.onchange = () => {
		// 		setLocationAvailable(result.state === "granted");
		// 	};
		// });
		// }

		const mql = matchMedia(`(max-width: ${MediaWidths.tablet}px)`);
		// Default to map for now, we could see if there is search results then we show search?
		setPanelInputMode(mql.matches ? "map" : "double");

		console.log(`matchMedia: we are in ${mql.matches ? "map" : "double"} panel mode`);

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
		console.log("showLocationModal effect: should run once");

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

	const handleGetLocationError = (error?: any, disableErrorPromptOnApp?: boolean) => {
		setGettingCurrentLocation(false);
		setLocationAvailable(false);

		// ASK WEILI
		// FIXME how to refactor this
		if (isLifeSgApp() && !!disableErrorPromptOnApp) {
			console.log("handleGetLocationError - disableErrorPromptOnApp");

			setShowGetLocationTimeoutError(false);
			return;
		}

		if (
			!isLifeSgApp() &&
			!!error["GeolocationPositionError"] &&
			Number.parseInt(error["GeolocationPositionError"]?.code) === global.GeolocationPositionError.TIMEOUT
		) {
			console.log("handleGetLocationError - timeout");

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

	// Refactor usage
	const isLifeSgApp = (): boolean => {
		return typeof window !== "undefined" && window.sessionStorage.getItem("lifeSg") === "true";
	};

	/**
	 * getCurrentLocation is to trigger the child components to carry their specific tasks
	 * no actual work is to be done here
	 */
	const getCurrentLocation = async () => {
		// FIXME fix this when working on permission change event
		// when to skip this?
		// if (!locationAvailable || !reverseGeoCodeEndpoint) {
		// 	handleGetLocationError(undefined, disableErrorPromptOnApp);
		// 	return;
		// }

		setGettingCurrentLocation(true);

		// TODO add documentation for how to cancel events and handle default
		// should debounce
		const shouldPreventDefault = !dispatchFieldEvent("get-current-location", id);

		if (!shouldPreventDefault) {
			console.log(">>>>> running default logic");

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
			console.log("Should render showGetLocationError");

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
			console.log("Should render showGetLocationTimeoutError");

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
								onOneMapError={handleOneMapError}
								onGetLocationCallback={handleGetLocationCallback}
								onGetLocationError={handleGetLocationError}
								onAddressChange={() => setSinglePanelMode("search")}
								onClearInput={() => setSinglePanelMode("map")}
								showLocationModal={showLocationModal}
								reverseGeoCodeEndpoint={reverseGeoCodeEndpoint}
								gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
								disableErrorPromptOnApp={disableErrorPromptOnApp}
								mustHavePostalCode={mustHavePostalCode}
							/>
							<StyledLocationPicker
								id={id}
								panelInputMode={panelInputMode}
								mapPanZoom={mapPanZoom}
								showLocationPicker={showLocationPicker}
								selectedLocationCoord={{
									lat: selectedAddressInfo.lat,
									lng: selectedAddressInfo.lng,
								}}
								interactiveMapPinIconUrl={interactiveMapPinIconUrl}
								mapRef={mapRef}
								onGetCurrentLocation={() => {
									locationAvailable && getCurrentLocation();
								}}
								locationAvailable={locationAvailable}
								gettingCurrentLocation={gettingCurrentLocation}
								onMapCenterChange={handleMapClick}
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
