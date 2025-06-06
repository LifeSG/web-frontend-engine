import axios from "axios";
import { debounce } from "lodash";
import { MutableRefObject } from "react";
import { OneMapService } from "../../../services";
import {
	OneMapBoolean,
	OneMapError,
	OneMapGeocodeInfo,
	OneMapSearchBuildingResult,
} from "../../../services/onemap/types";
import { ILocationCoord, IResultListItem, IResultsMetaData } from "./types";
import { MathHelper } from "../../../utils";

type TReverseGeocodeParams = {
	route: string;
	latitude: number;
	longitude: number;
	abortSignal?: AbortSignal;
	bufferRadius?: number;
	otherFeatures?: OneMapBoolean;
	options?: {
		excludeNonSG: boolean;
	};
};

export namespace LocationHelper {
	const mapService = OneMapService;

	export const getMapBounds = () => {
		return [
			{ lat: 1.56073, lng: 104.1147 }, // NE
			{ lat: 1.16, lng: 103.502 }, // SW
		];
	};

	export const getStaticMapUrl = mapService.getStaticMapUrl;

	export const searchByAddress = mapService.searchByAddress;

	// not paginated
	export const fetchLocationList = async (
		reverseGeoCodeEndpoint: string,
		lat: number,
		lng: number,
		mustHavePostalCode: boolean,
		reverseGeocodeAborter: MutableRefObject<AbortController>,
		onError: (error: any) => void,
		excludeNonSG?: boolean,
		bufferRadius?: number
	): Promise<IResultListItem[]> => {
		let onemapLocationList: IResultListItem[];

		try {
			reverseGeocodeAborter.current?.abort();
			reverseGeocodeAborter.current = new AbortController();
			onemapLocationList = (
				await reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
					abortSignal: reverseGeocodeAborter.current.signal,
					bufferRadius,
					otherFeatures: OneMapBoolean.YES,
					options: {
						excludeNonSG,
					},
				})
			).results;
			reverseGeocodeAborter.current = null;

			return onemapLocationList;
		} catch (error) {
			if (axios.isCancel(error)) throw error;

			const oneMapError = new OneMapError(error);
			onError(oneMapError);
			throw oneMapError;
		}
	};

	export const fetchAddress = async (
		query: string,
		pageNumber: number,
		onSuccess?: (results: IResultsMetaData) => void,
		onFail?: (error: unknown) => void
	) => {
		if (!query) return;
		try {
			const { results, pageNum, totalNumPages } = await searchByAddress({
				searchValue: query,
				getAddressDetails: OneMapBoolean.YES,
				returnGeom: OneMapBoolean.YES,
				pageNum: pageNumber,
			});

			const parsedResults = results.map((obj) => {
				const address = formatAddressFromGeocodeInfo(obj, true);
				return {
					address: address,
					blockNo: obj.BLK_NO,
					building: obj.BUILDING,
					postalCode: obj.POSTAL,
					roadName: obj.ROAD_NAME,
					lat: parseFloat(obj.LATITUDE) || undefined,
					lng: parseFloat(obj.LONGITUDE) || undefined,
					x: parseFloat(obj.X) || undefined,
					y: parseFloat(obj.Y) || undefined,
				};
			});

			onSuccess?.({
				results: parsedResults,
				apiPageNum: pageNum,
				totalNumPages,
			});
		} catch (error) {
			onFail?.(new OneMapError(error));
		}
	};

	export const checkAndSetPinLocationAsResult = (query: string): IResultsMetaData => {
		const [lat, lng] = query
			.split(":")[1]
			.split(",")
			.map((value) => parseFloat(value));
		let parsedResult = [];
		if (LocationHelper.isCoordinateInBounds({ lat, lng })) {
			parsedResult = [
				{
					address: query,
					lat,
					lng,
				},
			];
		}
		return {
			results: parsedResult,
			apiPageNum: 1,
			totalNumPages: 1,
		};
	};

	export const fetchSingleLocationByAddress = async (
		address: string,
		onSuccess: (resultListItem: IResultListItem | undefined) => void,
		onError: (e: any) => void
	) => {
		await debounceFetchAddress(
			address,
			1,
			(res) => {
				onSuccess(res.results?.[0] || undefined);
			},
			onError
		);
	};

	// does not normalise address
	export const debounceFetchAddress = debounce(fetchAddress, 500);
	// =========================================================================
	// reverseGeoCodeEndpoint
	// =========================================================================
	export const reverseGeocode = async ({
		bufferRadius,
		options,
		...others
	}: TReverseGeocodeParams): Promise<IResultsMetaData> => {
		if (!LocationHelper.isCoordinateInBounds({ lat: others.latitude, lng: others.longitude })) {
			throw new Error("Coordinate is outside Singapore");
		}

		let clampedBufferRadius = 500;
		if (typeof bufferRadius === "number") {
			clampedBufferRadius = Math.min(500, Math.max(0, bufferRadius));
			if (bufferRadius < 0 || bufferRadius > 500) {
				console.warn("bufferRadius must be between 0 and 500 meters.");
			}
		}

		const locationList = await mapService.reverseGeocode({ bufferRadius: clampedBufferRadius, ...others });
		const lat = others.latitude;
		const lng = others.longitude;

		let parsedLocationList = locationList.map<IResultListItem>((geoCodeInfo) => {
			const address = LocationHelper.formatAddressFromGeocodeInfo(geoCodeInfo, true);
			return {
				blockNo: geoCodeInfo.BLOCK,
				roadName: geoCodeInfo.ROAD,
				building: geoCodeInfo.BUILDINGNAME,
				postalCode: geoCodeInfo.POSTALCODE,
				x: parseFloat(geoCodeInfo.XCOORD) || undefined,
				y: parseFloat(geoCodeInfo.YCOORD) || undefined,
				lat: parseFloat(geoCodeInfo.LATITUDE) || undefined,
				lng: parseFloat(geoCodeInfo.LONGITUDE) || undefined,
				address: address,
				displayAddressText: address,
			};
		});

		if (options?.excludeNonSG) {
			parsedLocationList = parsedLocationList.filter(({ building }) => building !== "JOHOR (MALAYSIA)");
		}

		if (parsedLocationList.length === 0) {
			const address = `Pin location: ${lat}, ${lng}`;
			return {
				results: [
					{
						address,
						lat,
						lng,
						displayAddressText: address,
					},
				],
			};
		}

		return {
			results: parsedLocationList,
		};
	};

	export const fetchSingleLocationByLatLng = async (
		reverseGeoCodeEndpoint: string,
		convertLatLngToXYEndpoint: string,
		lat: number,
		lng: number,
		onSuccess: (resultListItem: IResultListItem | undefined) => void,
		onError: (e: any) => void,
		mustHavePostalCode?: boolean
	) => {
		(async () => {
			try {
				const locationList = (
					await reverseGeocode({
						route: reverseGeoCodeEndpoint,
						latitude: lat,
						longitude: lng,
					})
				).results;

				const nearestLocationIndex = LocationHelper.getNearestLocationIndexFromList(
					locationList,
					lat,
					lng,
					mustHavePostalCode
				);

				const { X, Y } = await OneMapService.convertLatLngToXY(convertLatLngToXYEndpoint, lat, lng);

				onSuccess({ ...locationList[nearestLocationIndex], lat, lng, x: X, y: Y } || undefined);
			} catch (error) {
				const oneMapError = new OneMapError(error);
				onError(oneMapError);
			}
		})();
	};

	// =========================================================================
	// HELPERS
	// =========================================================================
	export const hasGotAddressValue = (value?: string): boolean => {
		const lowercased = value?.toLowerCase();
		return !!value && lowercased !== "nil" && lowercased !== "null";
	};

	export const hasGotPinLocationValue = (value?: string): boolean => {
		if (!value) return false;
		const regex = /^(pin location:) -?\d{0,3}.\d*, -?\d{0,3}.\d*$/i;
		return regex.test(value.toLowerCase());
	};

	export const formatAddressFromGeocodeInfo = (
		geocodeInfo: OneMapGeocodeInfo | OneMapSearchBuildingResult,
		fallbackToLatLng = true
	) => {
		let convertedGeoCodeInfo = geocodeInfo;
		if (isOneMapSearchBuildingResults(geocodeInfo)) {
			convertedGeoCodeInfo = {
				BUILDINGNAME: geocodeInfo.BUILDING,
				BLOCK: geocodeInfo.BLK_NO,
				ROAD: geocodeInfo.ROAD_NAME,
				POSTALCODE: geocodeInfo.POSTAL,
				XCOORD: geocodeInfo.X,
				YCOORD: geocodeInfo.Y,
				LATITUDE: geocodeInfo.LATITUDE,
				LONGITUDE: geocodeInfo.LONGITUDE,
				LONGTITUDE: geocodeInfo.LONGTITUDE,
			};
		}
		const { BLOCK, BUILDINGNAME, POSTALCODE, ROAD } = convertedGeoCodeInfo as OneMapGeocodeInfo;
		const formattedAddressList: string[] = [];

		if (
			fallbackToLatLng &&
			!hasGotAddressValue(ROAD) &&
			!hasGotAddressValue(POSTALCODE) &&
			!hasGotAddressValue(BUILDINGNAME)
		) {
			const lat = parseFloat(geocodeInfo.LATITUDE) || 0;
			const lng = parseFloat(geocodeInfo.LONGITUDE) || 0;
			return `Pin location: ${lat}, ${lng}`;
		}

		if (hasGotAddressValue(BLOCK) && hasGotAddressValue(ROAD)) {
			formattedAddressList.push(`${BLOCK} ${ROAD}`);
		} else if (hasGotAddressValue(ROAD)) {
			formattedAddressList.push(ROAD);
		}

		if (hasGotAddressValue(BUILDINGNAME)) {
			formattedAddressList.push(BUILDINGNAME);
		}

		if (hasGotAddressValue(POSTALCODE)) {
			formattedAddressList.push(`SINGAPORE ${POSTALCODE}`);
		}

		return formattedAddressList.join(" ");
	};

	export const isOneMapSearchBuildingResults = (
		geoCodeInfo: OneMapGeocodeInfo | OneMapSearchBuildingResult
	): geoCodeInfo is OneMapSearchBuildingResult => {
		return (geoCodeInfo as OneMapSearchBuildingResult).BLK_NO !== undefined;
	};

	export const isCoordinateInBounds = (coordinate: ILocationCoord): boolean => {
		const [ne, sw] = getMapBounds();
		const { lat, lng } = coordinate;
		if (lat <= ne.lat && lat >= sw.lat && lng <= ne.lng && lng >= sw.lng) {
			return true;
		}
		return false;
	};

	const distanceBetweenTwoPoints = (coord1: ILocationCoord, coord2: ILocationCoord) => {
		if (coord1.lat === coord2.lat && coord1.lng === coord2.lng) {
			return 0;
		}

		const { degreesToRadians, radiansToDegrees, nauticalMilesToMetres } = MathHelper;
		const radlat1 = degreesToRadians(coord1.lat);
		const radlat2 = degreesToRadians(coord2.lat);

		const radtheta = degreesToRadians(coord1.lng - coord2.lng);

		let distInLat =
			Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

		if (distInLat > 1) {
			distInLat = 1;
		}

		return nauticalMilesToMetres(radiansToDegrees(Math.acos(distInLat)) * 60); // 60 minutes in 1 degree, 1 minute = 1 nautical mile
	};

	export const getNearestLocationIndexFromList = (
		locationList: Partial<IResultListItem>[],
		latitude: number,
		longitude: number,
		mustHavePostalCode?: boolean
	): number => {
		let shortestDistance = 1000000;
		let nearestLocationIndex = -1;
		locationList.forEach(({ lat, lng, postalCode }, index) => {
			const distance = distanceBetweenTwoPoints({ lat, lng }, { lat: latitude, lng: longitude });
			if (distance < shortestDistance) {
				if (!mustHavePostalCode || (mustHavePostalCode && hasGotAddressValue(postalCode))) {
					shortestDistance = distance;
					nearestLocationIndex = index;
				}
			}
		});
		return nearestLocationIndex;
	};
}
