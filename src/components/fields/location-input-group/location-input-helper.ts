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
import { LocationHelper } from "../../../utils";
import { ILocationInputValues } from "./types";

// TODO: keep this or LocationHelper?
export namespace LocationInputHelper {
	export const pagination = <T>(array: T[], pageSize: number, pageNum: number) => {
		return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
	};

	export const fetchAddress = async (
		query: string,
		pageNum: number,
		onSuccess?: (results: OneMapSearchResults) => void,
		onFail?: (error: unknown) => void
	) => {
		if (!query) return;
		try {
			const results = await OneMapService.searchByAddress({
				searchValue: query,
				getAddressDetails: OneMapBoolean.YES,
				returnGeom: OneMapBoolean.YES,
				pageNum: pageNum,
			});

			results.results = results.results.map((obj) => {
				const address = LocationHelper.formatAddressFromGeocodeInfo(obj, true);
				return {
					...obj,
					ADDRESS: address,
					DISPLAY_ADDRESS: address,
				};
			});

			onSuccess?.(results);
		} catch (error) {
			onFail?.(error);
		}
	};

	export const debounceFetchAddress = debounce(fetchAddress, 500);

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

	export const fetchSingleLocationByAddress = async (
		address: string,
		onSuccess: (locationInputValue: ILocationInputValues | undefined) => void
	) => {
		debounceFetchAddress(address, 1, (res) => {
			onSuccess(
				res.results?.[0]
					? {
							address: address,
							blockNo: res.results?.[0].BLK_NO,
							building: res.results?.[0].BUILDING,
							postalCode: res.results?.[0].POSTAL,
							roadName: res.results?.[0].ROAD_NAME,
							lat: parseFloat(res.results?.[0].LATITUDE) || undefined,
							lng: parseFloat(res.results?.[0].LONGITUDE) || undefined,
							x: parseFloat(res.results?.[0].X) || undefined,
							y: parseFloat(res.results?.[0].Y) || undefined,
					  }
					: undefined
			);
		});
	};

	export const fetchSingleLocationByLatLng = async (
		reverseGeoCodeEndpoint: string,
		lat: number,
		lng: number,
		onSuccess: (locationInputValue: ILocationInputValues | undefined) => void
	) => {
		(async () => {
			try {
				const locationList = await OneMapService.reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
				});
				onSuccess(
					locationList?.[0]
						? {
								address: LocationHelper.formatAddressFromGeocodeInfo(locationList?.[0], true),
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
				defaultDistanceLocations = await OneMapService.reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: lat,
					longitude: lng,
					abortSignal: reverseGeocodeAborter.current.signal,
					bufferRadius: 10,
					otherFeatures: OneMapBoolean.YES,
				});
			}
			// second call with get a list of locations within 500m
			const expandedSearchDistanceLocations = await OneMapService.reverseGeocode({
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
}
