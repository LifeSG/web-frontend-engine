import { ILocationCoord } from "src/components/fields/location-field/types";

export interface IGetCurrentLocationOptions {
	maxAttempts?: number;
	timeout?: number;
	maximumAge?: number;
}

export namespace GeoLocationHelper {
	const _getCurrentLocation = async (timeout: number, maximumAge: number): Promise<ILocationCoord> => {
		return new Promise<ILocationCoord>((resolve, reject) => {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
					({ coords }: GeolocationPosition) => resolve({ lat: coords.latitude, lng: coords.longitude }),
					(geolocationPositionError: GeolocationPositionError) => reject(geolocationPositionError),
					{ enableHighAccuracy: true, timeout, maximumAge }
				);
			} else {
				reject(new Error("geolocation not supported in this browser"));
			}
		});
	};

	/**
	 * @param options An optional options object that lets you specify the maximum no. of attempts (default: 1),
	 * the timeout in milliseconds (default: 2000), the maximum age of a possible cached position in milliseconds (default: 2000),
	 * and whether to disable the error prompt in the LifeSG app (default: false).
	 * A minimum of one attempt will be made, even if maxAttempts is 0.
	 * @returns A Promise that gets the current location.
	 * @resolve type: ILocationCoord
	 * @reject type: GeolocationPositionError | undefined
	 */
	export const getCurrentLocation = async (options: IGetCurrentLocationOptions = {}): Promise<ILocationCoord> => {
		const { maxAttempts = 1, timeout = 2000, maximumAge = 2000 } = options;
		let attemptCount = 0;

		// Use do-while loop so that _getCurrentLocation() is called at least once, even if maxAttempts is 0.
		// Realistically, this function shouldn't ever be called with maxAttempts = 0.
		// If anyone wants to pass in 0 for maxAttempts, they might as well not call this function at all.
		do {
			attemptCount++;

			// Timeout happens intermittently when user spams to get current location.
			// Retry a few times before giving up.
			try {
				return await _getCurrentLocation(timeout, maximumAge);
			} catch (error) {
				// Retry (by doing nothing here) if:
				// 1) Not yet reached max attempts, AND
				// 2) error instanceof GeolocationPositionError && error.code === error.TIMEOUT
				// Note: Using !error instead of !(error instanceof GeolocationPositionError)
				// to avoid "ReferenceError: GeolocationPositionError is not defined" in unit tests.
				if (attemptCount >= maxAttempts || !error || error.code !== error.TIMEOUT) {
					throw error;
				}
			}
		} while (attemptCount < maxAttempts);

		// This throw statement will never actually be reached, because when the do-while loop exits,
		// it will have either returned the result of _getCurrentLocation() or thrown an error.
		// This throw statement is just to make the return value of this function
		// Promise<ILocationCoord> instead of Promise<ILocationCoord | undefined>.
		throw "Failed to get current location";
	};
}
