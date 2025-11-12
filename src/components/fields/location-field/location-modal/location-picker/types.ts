import { TPanelInputMode } from "../..";
import { ILocationCoord } from "../../types";

export interface IMapPin extends ILocationCoord {
	address?: string | undefined;
	resultListItemText?: string | undefined;
	isCurrentLocation?: boolean | undefined;
}

export interface ILocationPickerProps extends React.InputHTMLAttributes<HTMLDivElement> {
	id?: string | undefined;
	className?: string | undefined;
	mapPanZoom?:
		| {
				mobile?: number | undefined;
				nonMobile?: number | undefined;
				min?: number | undefined;
				max?: number | undefined;
				duration?: number | undefined;
		  }
		| undefined;
	panelInputMode: TPanelInputMode;
	showLocationModal: boolean;
	selectedLocationCoord?: ILocationCoord | undefined;
	interactiveMapPinIconUrl?: string | undefined;
	getCurrentLocation: () => Promise<ILocationCoord>;
	locationAvailable: boolean;
	gettingCurrentLocation: boolean;
	onMapCenterChange: (latlng: ILocationCoord) => void;
	mapBannerText?: string | undefined;
	disableSelectionFromMap?: boolean | undefined;
	disableSelectedLocationMarker?: boolean | undefined;
	selectablePins: IMapPin[];
	pinsOnlyIndicateCurrentLocation?: boolean | undefined;
	currentLocation?: ILocationCoord | undefined;
}
