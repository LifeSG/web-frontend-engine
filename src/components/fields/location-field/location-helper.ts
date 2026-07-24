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
import { MathHelper } from "../../../utils";
import { NON_SG_COASTAL_OUTLINES, SG_COASTAL_OUTLINES } from "./singapore-boundary.data";
import { ILocationCoord, ILocationFieldValues, IResultListItem, IResultsMetaData } from "./types";

type TReverseGeocodeParams = {
	route: string;
	latitude: number;
	longitude: number;
	abortSignal?: AbortSignal;
	bufferRadius?: number;
	otherFeatures?: OneMapBoolean;
	headers?: Record<string, string>;
	getToken?: (action: string) => Promise<string | undefined>;
	options?: {
		excludeNonSG: boolean;
	};
};

// =============================================================================
// SINGAPORE BOUNDARY GEOMETRY (see singapore-boundary.data.ts)
// =============================================================================
/** how far offshore from a Singapore coastal outline still counts as Singapore waters */
const SG_WATERS_TOLERANCE_METRES = 10000;
const METRES_PER_DEG_LAT = 110574;
const METRES_PER_DEG_LNG = 111320 * Math.cos((1.35 * Math.PI) / 180); // longitude shrink at Singapore's latitude

const isPointInRing = (lat: number, lng: number, ring: [number, number][]): boolean => {
	// ray casting
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [latI, lngI] = ring[i];
		const [latJ, lngJ] = ring[j];
		if (latI > lat !== latJ > lat && lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI) {
			inside = !inside;
		}
	}
	return inside;
};

const isPointInAnyOutline = (lat: number, lng: number, outlines: [number, number][][]): boolean =>
	outlines.some((ring) => isPointInRing(lat, lng, ring));

const distanceToSegmentMetres = (
	lat: number,
	lng: number,
	segStart: [number, number],
	segEnd: [number, number]
): number => {
	const x = lng * METRES_PER_DEG_LNG;
	const y = lat * METRES_PER_DEG_LAT;
	const x1 = segStart[1] * METRES_PER_DEG_LNG;
	const y1 = segStart[0] * METRES_PER_DEG_LAT;
	const x2 = segEnd[1] * METRES_PER_DEG_LNG;
	const y2 = segEnd[0] * METRES_PER_DEG_LAT;
	const dx = x2 - x1;
	const dy = y2 - y1;
	if (!dx && !dy) return Math.hypot(x - x1, y - y1);
	const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
	return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
};

const minDistanceToOutlinesMetres = (lat: number, lng: number, outlines: [number, number][][]): number => {
	let min = Infinity;
	outlines.forEach((ring) => {
		for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
			min = Math.min(min, distanceToSegmentMetres(lat, lng, ring[j], ring[i]));
		}
	});
	return min;
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
		bufferRadius?: number,
		getToken?: (action: string) => Promise<string | undefined>,
		headers?: Record<string, string>
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
					getToken,
					headers,
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
		onFail?: (error: unknown) => void,
		searchEndpoint?: string,
		getToken?: (action: string) => Promise<string | undefined>,
		headers?: Record<string, string>
	) => {
		if (!query) return;
		try {
			const recaptchaToken = getToken ? await getToken("location_search") : undefined;
			const { results, pageNum, totalNumPages } = await searchByAddress(
				{
					searchValue: query,
					getAddressDetails: OneMapBoolean.YES,
					returnGeom: OneMapBoolean.YES,
					pageNum: pageNumber,
				},
				searchEndpoint,
				recaptchaToken,
				headers
			);

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
		onError: (e: any) => void,
		searchEndpoint?: string,
		getToken?: (action: string) => Promise<string | undefined>,
		headers?: Record<string, string>
	) => {
		await debounceFetchAddress(
			address,
			1,
			(res) => {
				onSuccess(res.results?.[0] || undefined);
			},
			onError,
			searchEndpoint,
			getToken,
			headers
		);
	};

	// does not normalise address
	export const debounceFetchAddress = debounce(fetchAddress, 500);
	// =========================================================================
	// reverseGeoCodeEndpoint
	// =========================================================================
	export const reverseGeocode = async ({
		bufferRadius,
		headers,
		getToken,
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

		const recaptchaToken = getToken ? await getToken("location_search") : undefined;
		const locationList = await mapService.reverseGeocode({
			bufferRadius: clampedBufferRadius,
			recaptchaToken,
			headers,
			...others,
		});
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
			parsedLocationList = parsedLocationList.filter(({ building }) => !hasNonSGBuildingValue(building));
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
		mustHavePostalCode?: boolean,
		getToken?: (action: string) => Promise<string | undefined>,
		headers?: Record<string, string>
	) => {
		(async () => {
			try {
				const locationList = (
					await reverseGeocode({
						route: reverseGeoCodeEndpoint,
						latitude: lat,
						longitude: lng,
						getToken,
						headers,
					})
				).results;

				const nearestLocationIndex = LocationHelper.getNearestLocationIndexFromList(
					locationList,
					lat,
					lng,
					mustHavePostalCode
				);

				const recaptchaToken = getToken ? await getToken("location_search") : undefined;
				const { X, Y } = await OneMapService.convertLatLngToXY(
					convertLatLngToXYEndpoint,
					lat,
					lng,
					recaptchaToken,
					headers
				);
				const nearestLocation = locationList[nearestLocationIndex];

				onSuccess(nearestLocation ? { ...nearestLocation, lat, lng, x: X, y: Y } : undefined);
			} catch (error) {
				const oneMapError = new OneMapError(error);
				onError(oneMapError);
			}
		})();
	};

	/**
	 * Checks whether a coordinate is outside Singapore, based on the coastal outlines of SLA's
	 * National Map Polygon dataset (see singapore-boundary.data.ts).
	 *
	 * A coordinate is outside Singapore when it falls within a neighbouring (JOHOR (MALAYSIA)) landmass,
	 * or when it is in open water that is beyond the waters tolerance of any Singapore coastal outline or
	 * closer to a neighbouring landmass than to Singapore. Waters near Singapore's coast (e.g. sea just off
	 * Changi, reservoirs) are considered part of Singapore.
	 */
	export const checkIsCoordinateOutsideSG = (coordinate: Partial<ILocationCoord>): boolean => {
		const { lat, lng } = coordinate || {};
		if (!lat || !lng) return true;
		if (isPointInAnyOutline(lat, lng, NON_SG_COASTAL_OUTLINES)) return true;
		if (isPointInAnyOutline(lat, lng, SG_COASTAL_OUTLINES)) return false;

		const distanceToSG = minDistanceToOutlinesMetres(lat, lng, SG_COASTAL_OUTLINES);
		const distanceToNonSG = minDistanceToOutlinesMetres(lat, lng, NON_SG_COASTAL_OUTLINES);
		return !(distanceToSG <= SG_WATERS_TOLERANCE_METRES && distanceToSG < distanceToNonSG);
	};

	/**
	 * Checks whether a location value is outside Singapore:
	 * - locations resolved to a neighbouring (JOHOR (MALAYSIA)) building are outside Singapore
	 * - locations with coordinates (searched addresses, map selections, pin locations) are checked
	 *   against the Singapore boundary via `checkIsCoordinateOutsideSG`
	 * - locations without coordinates are considered outside Singapore only if they are
	 *   unresolvable `Pin location: <lat>, <lng>` values
	 */
	export const checkIsLocationOutsideSG = (location: ILocationFieldValues | undefined): boolean => {
		if (LocationHelper.hasNonSGBuildingValue(location?.building)) return true;
		if (location?.lat && location?.lng) {
			return LocationHelper.checkIsCoordinateOutsideSG({ lat: location.lat, lng: location.lng });
		}
		return LocationHelper.hasGotPinLocationValue(location?.address);
	};

	// =========================================================================
	// HELPERS
	// =========================================================================
	export const hasGotAddressValue = (value?: string): boolean => {
		const lowercased = value?.toLowerCase();
		return !!value && lowercased !== "nil" && lowercased !== "null";
	};

	export const hasNonSGBuildingValue = (building?: string): boolean => {
		return building === "JOHOR (MALAYSIA)";
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
