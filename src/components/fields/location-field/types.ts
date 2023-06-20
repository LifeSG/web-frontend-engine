import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { IStaticMapProps } from "../../shared/static-map";
import { ILocationInputProps } from "./location-input";
import { ILocationModalProps } from "./location-modal/location-modal";
import { ILocationPickerProps } from "./location-modal/location-picker/types";

export interface ILocationInputSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"location-field", V>,
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

export interface ILocationCoord {
	lat: number;
	lng: number;
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

export type TSetIsApp = {
	isOnApp: boolean;
};
export interface TLocationInputDetail<T = unknown> {
	payload?: T | undefined;
	errors?: any | undefined;
}
export type TSetCurrentLocationDetail = TLocationInputDetail<ILocationCoord>;
export type TIsOnAppDetail = TLocationInputDetail<TSetIsApp>;

export type TLocationInputEvents = {
	"get-current-location": CustomEvent;
	"set-current-location": CustomEvent<TSetCurrentLocationDetail>;
	"get-is-app": CustomEvent;
	"set-is-app": CustomEvent<TIsOnAppDetail>;
};

export class GeolocationPositionErrorWrapper extends Error {
	public code;
	public message;

	public constructor(error: GeolocationPositionError) {
		super();
		Object.assign(this, error);
	}
}
