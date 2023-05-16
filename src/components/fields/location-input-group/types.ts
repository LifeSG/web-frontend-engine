import { OneMapSearchBuildingResult } from "../../../services/types";
import { IFrontendEngineBaseFieldJsonSchema } from "../../frontend-engine";
import { ILocationModalProps } from "./location-modal/location-modal";
import { ILocationPickerProps } from "./location-modal/location-picker";
import { ILocationSearchProps } from "./location-modal/location-search";

export interface ILocationInputSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"location-input", V>,
		Pick<ILocationPickerProps, "interactiveMapPinIconUrl" | "mapPanZoom">,
		Pick<ILocationSearchProps, "reverseGeoCodeEndpoint" | "disableErrorPromptOnApp" | "mustHavePostalCode">,
		Pick<ILocationModalProps, "locationPermissionErrorMessage"> {
	locationInputPlaceholder?: string;
	staticMapPinColor?: IColor;
}

export type TSinglePanelInputMode = "search" | "map";

export interface ILocationInputValues {
	address?: string;
	blockNo?: string;
	building?: string;
	postalCode?: string;
	roadName?: string;
	lat?: number;
	lng?: number;
	x?: number;
	y?: number;
}

export interface ILocationDisplayListParams {
	results: OneMapSearchBuildingResult[];
	queryString?: string;
	boldResults?: boolean;
	apiPageNum?: number;
	totalNumPages?: number;
	updateData?: boolean;
}

export interface IColor {
	r: number;
	g: number;
	b: number;
}
