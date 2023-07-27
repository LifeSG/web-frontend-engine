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
		if (!LocationHelper.isCoordinateInBounds({ lat: others.latitude, lng: others.longitude })) {
			throw new Error("Coordinate is outside Singapore");
		}

		const locationList = await mapService.reverseGeocode(others);
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
			const address = `Pin location ${Math.round(lat * 100) / 100}, ${Math.round(lng * 100) / 100}`;
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

	export const isCoordinateInBounds = (coordinate: ILocationCoord): boolean => {
		const [ne, sw] = getMapBounds();
		const { lat, lng } = coordinate;
		if (lat <= ne.lat && lat >= sw.lat && lng <= ne.lng && lng >= sw.lng) {
			return true;
		}
		return false;
	};
}
