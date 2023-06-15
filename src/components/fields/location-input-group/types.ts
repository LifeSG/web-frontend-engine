import { IFrontendEngineBaseFieldJsonSchema, TErrorPayload } from "../../frontend-engine";
import { ILocationCoord } from "./location-helper";
import { ILocationInputProps } from "./location-input";
import { ILocationModalProps } from "./location-modal/location-modal";
import { ILocationPickerProps } from "./location-modal/location-picker";
import { IStaticMapProps } from "./static-map";

export interface ILocationInputSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"location-input", V>,
		Pick<
			ILocationModalProps,
			"locationPermissionErrorMessage" | "mastheadHeight" | "hotlineContent" | "disableErrorPromptOnApp"
		>,
		Pick<ILocationPickerProps, "interactiveMapPinIconUrl" | "mapPanZoom">,
		Pick<
			ILocationSearchProps,
			"reverseGeoCodeEndpoint" | "mustHavePostalCode" | "gettingCurrentLocationFetchMessage"
		>,
		Pick<ILocationInputProps, "locationInputPlaceholder">,
		Pick<IStaticMapProps, "staticMapPinColor"> {}

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

export interface IResultListItem extends ILocationInputValues {
	displayAddressText?: string | undefined;
}

export interface IResultsMetaData {
	results: IResultListItem[];
	apiPageNum?: number | undefined;
	totalNumPages?: number | undefined;
}

export interface IDisplayResultListParams extends IResultsMetaData {
	queryString?: string | undefined;
	boldResults?: boolean | undefined;
}

// why is this here?
export interface ILocationSearchProps {
	id?: string | undefined;
	onCancel: () => void;
	onConfirm: () => void;
	panelInputMode: TPanelInputMode;
	addressFieldPlaceholder?: string | undefined;
	gettingCurrentLocation: boolean;
	gettingCurrentLocationFetchMessage?: string | undefined;
	locationListTitle?: string | undefined;
	selectedAddressInfo: ILocationInputValues;
	onChangeSelectedAddressInfo: (addressInfo: ILocationInputValues) => void;
	handleApiErrors: (error: any) => void;
	mustHavePostalCode?: boolean | undefined;
	reverseGeoCodeEndpoint?: string | undefined;
	onGetLocationCallback: (lat?: number | undefined, lng?: number | undefined) => void;
	showLocationModal: boolean;
	mapPickedLatLng?: ILocationCoord | undefined;
	formValues?: ILocationInputValues | undefined;
	updateFormValues: (values: ILocationInputValues) => void;
	setSinglePanelMode: (panelMode: TSinglePanelInputMode) => void;
}

// TODO compile event types
export interface ILocationInputEventDetail<T = unknown> {
	payload?: T | undefined;
	errors?: TErrorPayload | undefined;
}
export type TSetCurrentLocationDetail = ILocationInputEventDetail<ILocationCoord>;

export type TLocationInputEvent = CustomEvent<ILocationInputEventDetail>;

// Refactor
// How we want to consolidate and reexport?
export type TLocationInputEvents = {
	"get-current-location": undefined;
	"set-current-location": TSetCurrentLocationDetail;
};
