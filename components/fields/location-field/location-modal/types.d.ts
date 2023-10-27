import { ILocationFieldValues } from "../types";
import { ILocationPickerProps } from "./location-picker/types";
import { ILocationSearchProps } from "./location-search/types";
export interface ILocationModalProps extends Pick<ILocationPickerProps, "mapPanZoom" | "interactiveMapPinIconUrl">, Pick<ILocationSearchProps, "reverseGeoCodeEndpoint" | "convertLatLngToXYEndpoint" | "mustHavePostalCode" | "gettingCurrentLocationFetchMessage"> {
    id: string;
    className: string;
    showLocationModal: boolean;
    formValues?: ILocationFieldValues | undefined;
    locationModalStyles?: string | undefined;
    onClose: () => void;
    onConfirm: (values: ILocationFieldValues) => void;
    updateFormValues: (values: ILocationFieldValues, shouldDirty?: boolean) => void;
}
