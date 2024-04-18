import { TPanelInputMode } from "../..";
import { ILocationCoord } from "../../types";

export interface IMapPin extends ILocationCoord {
	address?: string | undefined;
	resultListItemText?: string | undefined;
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
		  }
		| undefined;
	panelInputMode: TPanelInputMode;
	showLocationModal: boolean;
	selectedLocationCoord?: ILocationCoord | undefined;
	interactiveMapPinIconUrl?: string | undefined;
	getCurrentLocation: () => void;
	handleGetCurrentLocation: () => Promise<ILocationCoord>;
	locationAvailable: boolean;
	gettingCurrentLocation: boolean;
	onMapCenterChange: (latlng: ILocationCoord) => void;
	mapBannerText?: string | undefined;
	disableSelectionFromMap?: boolean | undefined;
	disableCurrLocationMarker?: boolean | undefined;
	selectablePins: IMapPin[];
}
