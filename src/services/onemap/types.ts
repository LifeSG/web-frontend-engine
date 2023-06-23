export type OneMapGeocodeInfo = {
	BUILDINGNAME: string;
	BLOCK: string;
	ROAD: string;
	POSTALCODE: string;
	XCOORD: string;
	YCOORD: string;
	LATITUDE: string;
	LONGITUDE: string;
	/**
	 * @deprecated LONGTITUDE is deprecated and will be replaced by LONGITUDE
	 */
	LONGTITUDE: string;
};

export type OneMapSearchParam = {
	searchValue: string;
	returnGeom: OneMapBoolean;
	getAddressDetails: OneMapBoolean;
	pageNum: number;
};

export enum OneMapBoolean {
	YES = "Y",
	NO = "N",
}

export type OneMapSearchResults = {
	found: number;
	totalNumPages: number;
	pageNum: number;
	results: OneMapSearchBuildingResult[];
};

export type OneMapSearchBuildingResult = {
	SEARCHVAL: string;
	BLK_NO: string;
	ROAD_NAME: string;
	BUILDING: string;
	ADDRESS: string;
	POSTAL: string;
	X: string;
	Y: string;
	LATITUDE: string;
	LONGITUDE: string;
	LONGTITUDE: string;
	DISPLAY_ADDRESS?: string;
};

export interface IColor {
	r: number;
	g: number;
	b: number;
}

export class OneMapError extends Error {
	public innerError: any;

	public constructor(error: any, message = "One map error") {
		super(message);
		this.name = "OneMapError";
		this.innerError = error;
		Error.captureStackTrace(this, OneMapError);
	}
}
