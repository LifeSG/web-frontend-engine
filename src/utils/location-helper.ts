import { OneMapGeocodeInfo, OneMapSearchBuildingResult } from "../services/onemap/types";
import { MathHelper } from "./math-helper";
// import { DeviceActions, WebviewHelper } from "./webview-helper";

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

export namespace LocationHelper {
	// const _getCurrentLocation = async (
	// 	timeout: number,
	// 	maximumAge: number,
	// 	disableErrorPromptOnApp: boolean
	// ): Promise<ILocationCoord> => {
	// 	return new Promise<ILocationCoord>((resolve, reject) => {
	// 		if (WebviewHelper.isLifeSgApp()) {
	// 			(window as any).lifeSgGetCurrentPositionSuccessCallback = (lat: number, lng: number) =>
	// 				resolve({ lat, lng });
	// 			(window as any).lifeSgGetCurrentPositionFailureCallback = () => reject();

	// 			WebviewHelper.postWebviewMessage(
	// 				disableErrorPromptOnApp
	// 					? DeviceActions.GET_CURRENT_POSITION_DISABLE_PROMPT
	// 					: DeviceActions.GET_CURRENT_POSITION
	// 			);
	// 		} else {
	// 			navigator.geolocation.getCurrentPosition(
	// 				({ coords }: GeolocationPosition) => resolve({ lat: coords.latitude, lng: coords.longitude }),
	// 				(geolocationPositionError: GeolocationPositionError) => reject(geolocationPositionError),
	// 				{ enableHighAccuracy: true, timeout, maximumAge }
	// 			);
	// 		}
	// 	});
	// };

	// /**
	//  * @param options An optional options object that lets you specify the maximum no. of attempts (default: 1),
	//  * the timeout in milliseconds (default: 2000), the maximum age of a possible cached position in milliseconds (default: 2000),
	//  * and whether to disable the error prompt in the LifeSG app (default: false).
	//  * A minimum of one attempt will be made, even if maxAttempts is 0.
	//  * @returns A Promise that gets the current location.
	//  * @resolve type: ILocationCoord
	//  * @reject type: GeolocationPositionError | undefined
	//  */
	// export const getCurrentLocation = async (options: IGetCurrentLocationOptions = {}): Promise<ILocationCoord> => {
	// 	const { maxAttempts = 1, timeout = 2000, maximumAge = 2000, disableErrorPromptOnApp = false } = options;
	// 	let attemptCount = 0;

	// 	// Use do-while loop so that _getCurrentLocation() is called at least once, even if maxAttempts is 0.
	// 	// Realistically, this function shouldn't ever be called with maxAttempts = 0.
	// 	// If anyone wants to pass in 0 for maxAttempts, they might as well not call this function at all.
	// 	do {
	// 		attemptCount++;

	// 		// Timeout happens intermittently when user spams to get current location.
	// 		// Retry a few times before giving up.
	// 		try {
	// 			return await _getCurrentLocation(timeout, maximumAge, disableErrorPromptOnApp);
	// 		} catch (error) {
	// 			// Retry (by doing nothing here) if:
	// 			// 1) Not yet reached max attempts, AND
	// 			// 2) error instanceof GeolocationPositionError && error.code === error.TIMEOUT
	// 			// Note: Using !error instead of !(error instanceof GeolocationPositionError)
	// 			// to avoid "ReferenceError: GeolocationPositionError is not defined" in unit tests.
	// 			if (attemptCount >= maxAttempts || !error || error.code !== error.TIMEOUT) {
	// 				throw error;
	// 			}
	// 		}
	// 	} while (attemptCount < maxAttempts);

	// 	// This throw statement will never actually be reached, because when the do-while loop exits,
	// 	// it will have either returned the result of _getCurrentLocation() or thrown an error.
	// 	// This throw statement is just to make the return value of this function
	// 	// Promise<ILocationCoord> instead of Promise<ILocationCoord | undefined>.
	// 	throw "Failed to get current location";
	// };

	export const hasGotAddressValue = (value?: string): boolean => {
		const lowercased = value?.toLowerCase();
		return !!value && lowercased !== "nil" && lowercased !== "null";
	};

	export const formatAddressFromGeocodeInfo = (
		geocodeInfo: OneMapGeocodeInfo | OneMapSearchBuildingResult,
		fallbackToLatLng = false
	) => {
		let convertedGeoCodeInfo = geocodeInfo;
		if (LocationHelper.isOneMapSearchBuildingResults(geocodeInfo)) {
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
			!LocationHelper.hasGotAddressValue(ROAD) &&
			!LocationHelper.hasGotAddressValue(POSTALCODE) &&
			!LocationHelper.hasGotAddressValue(BUILDINGNAME)
		) {
			const lat = parseFloat(geocodeInfo.LATITUDE) || 0;
			const lng = parseFloat(geocodeInfo.LONGITUDE) || 0;
			return `Pin location ${Math.round(lat * 100) / 100}, ${Math.round(lng * 100) / 100}`;
		}

		if (LocationHelper.hasGotAddressValue(BLOCK) && LocationHelper.hasGotAddressValue(ROAD)) {
			formattedAddressList.push(`${BLOCK} ${ROAD}`);
		} else if (LocationHelper.hasGotAddressValue(ROAD)) {
			formattedAddressList.push(ROAD);
		}
		if (LocationHelper.hasGotAddressValue(BUILDINGNAME)) {
			formattedAddressList.push(BUILDINGNAME);
		}
		if (LocationHelper.hasGotAddressValue(POSTALCODE)) {
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
		return LocationHelper.distanceBetweenTwoPoints(coord1, coord2) <= radius;
	};
}
