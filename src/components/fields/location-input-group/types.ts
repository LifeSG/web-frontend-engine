import { IColor, OneMapSearchBuildingResult } from "../../../services/onemap/types";
import { ILocationCoord } from "../../../utils";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { ILocationInputProps } from "./location-input";
// import { ILocationModalProps } from "./location-modal/location-modal";
// import { ILocationPickerProps } from "./location-modal/location-picker";

export interface ILocationInputSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"location-input", V>,
		Pick<ILocationInputProps, "locationInputPlaceholder"> {
	// Pick<ILocationModalProps, "locationPermissionErrorMessage">
	// Pick<ILocationPickerProps, "interactiveMapPinIconUrl" | "mapPanZoom">,
	// Pick<ILocationSearchProps, "reverseGeoCodeEndpoint" | "disableErrorPromptOnApp" | "mustHavePostalCode">
	// staticMapPinColor?: IColor | undefined;
}

export type TSinglePanelInputMode = "search" | "map";

// search and map will implicitly mean single panel can only show one view at a time: search or map
// double means both search and map will be seen
export type TPanelInputMode = "search" | "map" | "double";

export interface ILocationInputValues {
	address?: string | undefined;
	blockNo?: string | undefined;
	building?: string | undefined;
	postalCode?: string | undefined;
	roadName?: string | undefined;
	lat?: number | undefined;
	lng?: number | undefined;
	x?: number | undefined;
	y?: number | undefined;
}

export interface ILocationDisplayListParams {
	results: OneMapSearchBuildingResult[];
	queryString?: string | undefined;
	boldResults?: boolean | undefined;
	apiPageNum?: number | undefined;
	totalNumPages?: number | undefined;
	updateData?: boolean | undefined;
}

export interface IListItem extends ILocationInputValues {
	displayText?: string | undefined;
}

export interface ILocationSearchProps {
	id?: string;
	onCancel: () => void;
	onConfirm: () => void;
	isSinglePanel: boolean;
	panelInputMode: TPanelInputMode;
	addressFieldPlaceholder?: string | undefined;
	gettingCurrentLocation: boolean;
	gettingCurrentLocationFetchMessage?: string | undefined;
	locationListTitle?: string | undefined;
	selectedAddressInfo: ILocationInputValues;
	onChangeSelectedAddressInfo: (addressInfo: ILocationInputValues) => void;
	onOneMapError: () => void;
	mustHavePostalCode?: boolean | undefined;
	disableErrorPromptOnApp?: boolean | undefined;
	reverseGeoCodeEndpoint?: string | undefined;
	onGetLocationCallback: (lat?: number | undefined, lng?: number | undefined) => void;
	onGetLocationError: (
		geolocationPositionError?: GeolocationPositionError | undefined,
		disableErrorPromptOnApp?: boolean | undefined
	) => void;
	onAddressChange: () => void;
	showLocationModal: boolean;
	mapPickedLatLng?: ILocationCoord | undefined;
	didUserClickMap: boolean;
	onClearInput: () => void;
	formValues?: ILocationInputValues | undefined;
	updateFormValues: (values: ILocationInputValues) => void;
}
