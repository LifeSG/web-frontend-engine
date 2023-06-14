import { debounce } from "lodash";
import { MutableRefObject } from "react";
import sanitizeHtml from "sanitize-html";
import { OneMapService } from "../../../services";
import {
	OneMapBoolean,
	OneMapGeocodeInfo,
	OneMapSearchBuildingResult,
	OneMapSearchResults,
} from "../../../services/onemap/types";
import { MathHelper } from "../../../utils";

import { ILocationInputValues } from "./types";

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

// this is intermediary layer so use this as source of truth
// should oneMapservice transform to conform to the data specified here?
export namespace LocationHelper {
	const _mapService = OneMapService;

	export const getStaticMapUrl = _mapService.getStaticMapUrl;

	export const reverseGeocode = _mapService.reverseGeocode;

	export const fetchSingleLocationByAddress = async (
		address: string,
		onSuccess: (locationInputValue: ILocationInputValues | undefined) => void
	) => {
		console.log("fetchSingleLocationByAddress ran");

		console.log("debounceFetchAddress", debounceFetchAddress);

		await debounceFetchAddress(address, 1, (res) => {
			console.log("debounceFetchAddress: ", res);

			onSuccess(
				res.results?.[0]
					? {
						/* eslint-disable prettier/prettier */
						address: address,
						blockNo: res.results?.[0].BLK_NO,
						building: res.results?.[0].BUILDING,
						postalCode: res.results?.[0].POSTAL,
						roadName: res.results?.[0].ROAD_NAME,
						lat: parseFloat(res.results?.[0].LATITUDE) || undefined,
						lng: parseFloat(res.results?.[0].LONGITUDE) || undefined,
						x: parseFloat(res.results?.[0].X) || undefined,
						y: parseFloat(res.results?.[0].Y) || undefined,
						/* eslint-disable prettier/prettier */
					}
					: undefined
			);
		});
	};

	// paginated fetch address
	export const fetchAddress = async (
		query: string,
		pageNum: number,
		onSuccess?: (results: OneMapSearchResults) => void,
		onFail?: (error: unknown) => void
	) => {
		if (!query) return;
		try {
			const results = await _mapService.searchByAddress({
				searchValue: query,
				getAddressDetails: OneMapBoolean.YES,
				returnGeom: OneMapBoolean.YES,
				pageNum: pageNum,
			});

			results.results = results.results.map((obj) => {
				const address = formatAddressFromGeocodeInfo(obj, true);
				return {
					...obj,
					ADDRESS: address,
					DISPLAY_ADDRESS: address,
				};
			});

			console.log(results);

			onSuccess?.(results);
		} catch (error) {
			onFail?.(error);
		}
	};

	// does not normalise address
	export const debounceFetchAddress = debounce(fetchAddress, 500);
	// =========================================================================
	// reverseGeoCodeEndpoint
	// =========================================================================

	// prefill on mount
	export const fetchSingleLocationByLatLng = async (
		reverseGeoCodeEndpoint: string,
		lat: number,
		lng: number,
		onSuccess: (locationInputValue: ILocationInputValues | undefined) => void
	) => {
		(async () => {
			try {
				const locationList = await reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
				});
				onSuccess(
					locationList?.[0]
						? {
							address: formatAddressFromGeocodeInfo(locationList?.[0], true),
							blockNo: locationList[0].BLOCK,
							building: locationList[0].BUILDINGNAME,
							postalCode: locationList[0].POSTALCODE,
							roadName: locationList[0].ROAD,
							lat: parseFloat(locationList[0].LATITUDE),
							lng: parseFloat(locationList[0].LONGITUDE),
							x: parseFloat(locationList[0].XCOORD) || undefined,
							y: parseFloat(locationList[0].YCOORD) || undefined,
						  }
						: undefined
				);
			} catch (error) {}
		})();
	};

	// not paginated
	export const fetchLocationList = async (
		reverseGeoCodeEndpoint: string,
		lat: number,
		lng: number,
		mustHavePostalCode: boolean,
		reverseGeocodeAborter: MutableRefObject<AbortController>,
		onError: (error: any) => void
	) => {
		/*
		2 API calls are made to OneMap due to how the reverse geocoding search works.
		If a place with no postal code is selected, it will be excluded from the search results
		if there are other results with postal codes within the search buffer distance. e.g. (Punggol Waterway Park)
		 */

		let defaultDistanceLocations: OneMapGeocodeInfo[] = [];
		let onemapLocationList: OneMapGeocodeInfo[] = [];

		try {
			reverseGeocodeAborter.current?.abort();
			reverseGeocodeAborter.current = new AbortController();
			// first call will get the location on the spot within 10 meters
			if (!mustHavePostalCode) {
				defaultDistanceLocations = await reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
					abortSignal: reverseGeocodeAborter.current.signal,
					bufferRadius: 10,
					otherFeatures: OneMapBoolean.YES,
				});
			}
			// second call with get a list of locations within 500m
			const expandedSearchDistanceLocations = await reverseGeocode({
				route: reverseGeoCodeEndpoint,
				latitude: lat,
				longitude: lng,
				abortSignal: reverseGeocodeAborter.current.signal,
				bufferRadius: 500,
				otherFeatures: OneMapBoolean.YES,
			});
			// ensure that there are no duplicate search results
			const buildingNames = new Set(expandedSearchDistanceLocations.map((val) => val.BUILDINGNAME));
			onemapLocationList = onemapLocationList.concat(
				defaultDistanceLocations.filter((res) => !buildingNames.has(res.BUILDINGNAME)),
				expandedSearchDistanceLocations
			);
			reverseGeocodeAborter.current = null;

			return onemapLocationList;
		} catch (error) {
			onError(error);
		}
	};

	// =========================================================================
	// HELPERS
	// =========================================================================
	export const pagination = <T>(array: T[], pageSize: number, pageNum: number) => {
		return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
	};

	export const boldResultsWithQuery = (arr: OneMapSearchBuildingResult[], query: string) => {
		const regex = new RegExp(query, "gi");
		return arr.map((obj) => {
			const newAddress = (obj.DISPLAY_ADDRESS || obj.ADDRESS).replace(
				regex,
				`<span class="keyword">${query}</span>`
			);
			return {
				...obj,
				DISPLAY_ADDRESS: newAddress,
			};
		});
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

		// HUHHHHHH refactor this
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
