import { debounce } from "lodash";
import { MutableRefObject } from "react";
import sanitizeHtml from "sanitize-html";
import { OneMapService } from "../../../services";
import {
	OneMapBoolean,
	OneMapError,
	OneMapGeocodeInfo,
	OneMapSearchBuildingResult,
} from "../../../services/onemap/types";
import { MathHelper } from "../../../utils";

import { IResultListItem, IResultsMetaData } from "./types";

export interface ILocationCoord {
	lat: number;
	lng: number;
}

export interface IGetCurrentLocationOptions {
	maxAttempts?: number;
	timeout?: number;
	maximumAge?: number;
	disableErrorPromptOnApp?: boolean;
}

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

// this is intermediary layer so use this as source of truth
// should oneMapservice transform to conform to the data specified here?
export namespace LocationHelper {
	const mapService = OneMapService;

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
		excludeNonSG?: boolean
	): Promise<IResultListItem[]> => {
		/*
			2 API calls are made to OneMap due to how the reverse geocoding search works.
			If a place with no postal code is selected, it will be excluded from the search results
			if there are other results with postal codes within the search buffer distance. e.g. (Punggol Waterway Park)
			 */

		let defaultDistanceLocations: IResultListItem[] = [];
		let onemapLocationList: IResultListItem[] = [];

		try {
			reverseGeocodeAborter.current?.abort();
			reverseGeocodeAborter.current = new AbortController();
			// first call will get the location on the spot within 10 meters
			if (!mustHavePostalCode) {
				const defaultDistanceLocationsResult = await reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
					abortSignal: reverseGeocodeAborter.current.signal,
					bufferRadius: 10,
					otherFeatures: OneMapBoolean.YES,
					options: {
						excludeNonSG,
					},
				});
				defaultDistanceLocations = defaultDistanceLocationsResult.results;
			}
			// second call with get a list of locations within 500m
			const expandedSearchDistanceLocations = await reverseGeocode({
				route: reverseGeoCodeEndpoint,
				latitude: lat,
				longitude: lng,
				abortSignal: reverseGeocodeAborter.current.signal,
				bufferRadius: 500,
				otherFeatures: OneMapBoolean.YES,
				options: {
					excludeNonSG,
				},
			});
			// ensure that there are no duplicate search results
			const buildingNames = new Set(expandedSearchDistanceLocations.results.map((val) => val.building));
			onemapLocationList = onemapLocationList.concat(
				defaultDistanceLocations.filter((res) => !buildingNames.has(res.building)),
				expandedSearchDistanceLocations.results
			);
			reverseGeocodeAborter.current = null;

			return onemapLocationList;
		} catch (error) {
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
	export const reverseGeocode = async ({ options, ...others }: TReverseGeocodeParams): Promise<IResultsMetaData> => {
		const locationList = await mapService.reverseGeocode(others);
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

		// default to false
		if (options?.excludeNonSG) {
			parsedLocationList = parsedLocationList.filter(({ building }) => building !== "JOHOR (MALAYSIA)");
		}

		return {
			results: parsedLocationList,
		};
	};

	// prefill on mount
	export const fetchSingleLocationByLatLng = async (
		reverseGeoCodeEndpoint: string,
		lat: number,
		lng: number,
		onSuccess: (resultListItem: IResultListItem | undefined) => void,
		onError: (e: any) => void
	) => {
		(async () => {
			try {
				const locationList = await reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
				});

				onSuccess(locationList.results[0] || undefined);
			} catch (error) {
				onError(error);
			}
		})();
	};

	// =========================================================================
	// HELPERS
	// =========================================================================
	export const boldResultsWithQuery = (arr: IResultListItem[], query: string) => {
		const regex = new RegExp(query, "gi");
		return arr.map((obj) => {
			const newAddress = (obj.displayAddressText || obj.address).replace(
				regex,
				`<span class="keyword">${query}</span>`
			);
			return {
				...obj,
				displayAddressText: newAddress,
			};
		});
	};

	export const pagination = <T>(array: T[], pageSize: number, pageNum: number) => {
		return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
	};

	export const cleanHtml = (html: string | undefined) => {
		if (!html) return;
		return {
			__html: sanitizeHtml(html, {
				allowedTags: ["span"],
				allowedAttributes: {
					span: ["class"],
				},
			}),
		};
	};

	export const hasGotAddressValue = (value?: string): boolean => {
		const lowercased = value?.toLowerCase();
		return !!value && lowercased !== "nil" && lowercased !== "null";
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
			return `Pin location ${Math.round(lat * 100) / 100}, ${Math.round(lng * 100) / 100}`;
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

	/**
	 * Calculates the distance between two coordinates in metres, using the Haversine formula.
	 * Formula reference: https://www.geodatasource.com/developers/javascript
	 */
	export const distanceBetweenTwoPoints = (coord1: ILocationCoord, coord2: ILocationCoord) => {
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

	/**
	 * Checks whether a location is within a certain distance from another.
	 * @param coord1 The coordinates of the first location.
	 * @param coord2 The coordinates of the second location.
	 * @param radius The distance in metres.
	 * @returns true if the distance between coord1 and coord2 is <= radius, false otherwise.
	 */
	export const checkIsWithinRadius = (coord1: ILocationCoord, coord2: ILocationCoord, radius: number) => {
		return distanceBetweenTwoPoints(coord1, coord2) <= radius;
	};
}
