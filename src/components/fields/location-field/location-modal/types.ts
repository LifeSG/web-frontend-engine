import { ILocationInputValues } from "../types";
import { ILocationSearchProps } from "./location-search/types";
import { ILocationPickerProps } from "./location-picker/types";
import { HotlineContent } from "./location-modal";

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
	locationPermissionErrorMessage?: string | undefined;
	hotlineContent?: HotlineContent | undefined;
	updateFormValues: (values: ILocationInputValues) => void;
	mastheadHeight?: number;
	disableErrorPromptOnApp?: boolean;
}
