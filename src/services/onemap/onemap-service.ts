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

type ReverseGeocodeParams = {
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
}: ReverseGeocodeParams) => {
	const res = await clientWithCredentials.get<{ data: { GeocodeInfo: OneMapGeocodeInfo[] } }>(route, {
		params: { latitude, longitude, bufferRadius, otherFeatures },
		signal: abortSignal,
	});

	return res.data.GeocodeInfo;
};

const searchByAddress = async (param: OneMapSearchParam): Promise<OneMapSearchResults> => {
	const { searchValue, returnGeom, getAddressDetails, pageNum } = param;
	const res = await client.get<OneMapSearchResults>("https://developers.onemap.sg/commonapi/search", {
		params: { searchVal: searchValue, returnGeom, getAddrDetails: getAddressDetails, pageNum },
	});
	return res;
};

const getStaticMap = (lat: number, lng: number, width: number, height: number, pinColor: IColor): string => {
	const { r, g, b } = pinColor;
	return `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=${lat}&lng=${lng}&zoom=17&height=${height}&width=${width}&points=[${lat},${lng},"${r},${g},${b}"]`;
};

export const OneMapService = {
	reverseGeocode,
	searchByAddress,
	getStaticMap,
};
