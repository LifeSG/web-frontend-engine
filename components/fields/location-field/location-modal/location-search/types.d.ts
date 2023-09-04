import { ILocationCoord, ILocationFieldValues, TPanelInputMode, TSinglePanelInputMode } from "../../types";
export interface ILocationSearchProps {
    id?: string | undefined;
    onCancel: () => void;
    onConfirm: () => void;
    panelInputMode: TPanelInputMode;
    addressFieldPlaceholder?: string | undefined;
    gettingCurrentLocation: boolean;
    gettingCurrentLocationFetchMessage?: string | undefined;
    locationListTitle?: string | undefined;
    selectedAddressInfo: ILocationFieldValues;
    onChangeSelectedAddressInfo: (addressInfo: ILocationFieldValues) => void;
    handleApiErrors: (error: any) => void;
    mustHavePostalCode?: boolean | undefined;
    reverseGeoCodeEndpoint?: string | undefined;
    onGetLocationCallback: (lat?: number | undefined, lng?: number | undefined) => void;
    showLocationModal: boolean;
    mapPickedLatLng?: ILocationCoord | undefined;
    formValues?: ILocationFieldValues | undefined;
    updateFormValues: (values: ILocationFieldValues, shouldDirty?: boolean) => void;
    setSinglePanelMode: (panelMode: TSinglePanelInputMode) => void;
}
