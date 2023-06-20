import { ILocationCoord, ILocationInputValues, TPanelInputMode, TSinglePanelInputMode } from "../../types";

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
