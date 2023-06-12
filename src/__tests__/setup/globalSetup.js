import { randomUUID } from "node:crypto";
window.crypto.randomUUID = randomUUID;
window.GeolocationPositionError = {
	PERMISSION_DENIED: 1,
	POSITION_UNAVAILABLE: 2,
	TIMEOUT: 3,
};
