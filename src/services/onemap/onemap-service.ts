import { AxiosApiClient } from "../../utils/api-client/api-client";
import { IColor, OneMapBoolean, OneMapGeocodeInfo, OneMapSearchParam, OneMapSearchResults } from "./types";

const client = new AxiosApiClient(
	"",
	undefined, // use default
	undefined // use default
);

const clientWithCredentials = new AxiosApiClient(
	"",
	undefined, // use default
	undefined, // use default
	true
);

type TReverseGeocodeParams = {
	route: string;
	latitude: number;
	longitude: number;
	abortSignal?: AbortSignal;
	bufferRadius?: number;
	otherFeatures?: OneMapBoolean;
};

const reverseGeocode = async ({
	route,
	latitude,
	longitude,
	abortSignal,
	bufferRadius,
	otherFeatures,
}: TReverseGeocodeParams) => {
	const res = await clientWithCredentials.get<{ data: { GeocodeInfo: OneMapGeocodeInfo[] } }>(route, {
		params: { latitude, longitude, bufferRadius, otherFeatures },
		signal: abortSignal,
	});

	return res.data.GeocodeInfo;
};

// one map has a bug where it cant match exact matchs
// splitting the query allows it to match....
const searchByAddress = async (param: OneMapSearchParam): Promise<OneMapSearchResults> => {
	const { searchValue, returnGeom, getAddressDetails, pageNum } = param;
	const res = await client.get<OneMapSearchResults>("https://www.onemap.gov.sg/api/common/elastic/search", {
		params: { searchVal: searchValue, returnGeom, getAddrDetails: getAddressDetails, pageNum },
	});
	return res;
};

const convertLatLngToXY = async (
	route: string,
	latitude: number,
	longitude: number
): Promise<{
	X: number;
	Y: number;
}> => {
	const res: any = await clientWithCredentials.get(route, {
		params: { latitude, longitude },
	});
	return res?.data;
};

const getStaticMapUrl = (lat: number, lng: number, width: number, height: number, pinColor: IColor): string => {
	const { r, g, b } = pinColor;
	return `https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=default&latitude=${lat}&longitude=${lng}&zoom=17&height=${height}&width=${width}&points=[${lat},${lng},"${r},${g},${b}"]`;
};

export const OneMapService = {
	reverseGeocode,
	searchByAddress,
	convertLatLngToXY,
	getStaticMapUrl,
};
