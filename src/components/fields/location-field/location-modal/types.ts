import { ILocationInputValues } from "../types";
import { ILocationPickerProps } from "./location-picker/types";
import { ILocationSearchProps } from "./location-search/types";

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
	updateFormValues: (values: ILocationInputValues) => void;
}
