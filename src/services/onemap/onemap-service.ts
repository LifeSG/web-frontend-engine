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
	recaptchaToken?: string;
	headers?: Record<string, string>;
};

const reverseGeocode = async ({
	route,
	latitude,
	longitude,
	abortSignal,
	bufferRadius,
	otherFeatures,
	recaptchaToken,
	headers,
}: TReverseGeocodeParams) => {
	const res = await clientWithCredentials.post<{ GeocodeInfo: OneMapGeocodeInfo[] }>(
		route,
		{},
		{
			headers: {
				...(headers || {}),
				...(recaptchaToken && { "x-recaptcha-token": recaptchaToken }),
			},
			params: { location: `${latitude},${longitude}`, buffer: bufferRadius, otherFeatures },
			signal: abortSignal,
		}
	);
	return res.GeocodeInfo;
};

// one map has a bug where it cant match exact matchs
// splitting the query allows it to match....
const searchByAddress = async (
	param: OneMapSearchParam,
	route?: string,
	recaptchaToken?: string,
	headers?: Record<string, string>
): Promise<OneMapSearchResults> => {
	const { searchValue, returnGeom, getAddressDetails, pageNum } = param;

	const res = await client.post<OneMapSearchResults>(
		route,
		{},
		{
			headers: {
				...(headers || {}),
				...(recaptchaToken && { "x-recaptcha-token": recaptchaToken }),
			},
			params: { searchVal: searchValue, returnGeom, getAddrDetails: getAddressDetails, pageNum },
		}
	);
	return res;
};

const convertLatLngToXY = async (
	route: string,
	latitude: number,
	longitude: number,
	recaptchaToken?: string,
	headers?: Record<string, string>
): Promise<{
	X: number;
	Y: number;
}> => {
	const res = await clientWithCredentials.post<{ X: number; Y: number }>(
		route,
		{},
		{
			headers: {
				...(headers || {}),
				...(recaptchaToken && { "x-recaptcha-token": recaptchaToken }),
			},
			params: { latitude, longitude },
		}
	);
	return res;
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
