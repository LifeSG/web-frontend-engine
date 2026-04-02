import { ILocationCoord } from "src/components/fields/location-field/types";
export interface IGetCurrentLocationOptions {
    maxAttempts?: number;
    timeout?: number;
    maximumAge?: number;
}
export declare namespace GeoLocationHelper {
    /**
     * @param options An optional options object that lets you specify the maximum no. of attempts (default: 3),
     * the timeout in milliseconds (default: 2000), the maximum age of a possible cached position in milliseconds (default: 2000)
     * A minimum of one attempt will be made, even if maxAttempts is 0.
     * @returns A Promise that gets the current location.
     * @resolve type: ILocationCoord
     * @reject type: GeolocationPositionError | undefined
     */
    const getCurrentLocation: (options?: IGetCurrentLocationOptions) => Promise<ILocationCoord>;
}
