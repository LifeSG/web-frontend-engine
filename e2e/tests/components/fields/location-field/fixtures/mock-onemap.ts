import { Page } from "@playwright/test";

export const mockOneMapAPI = async (page: Page) => {
	await page.route("/api/onemap/**", async (route) => {
		const url = new URL(route.request().url());
		const pathname = url.pathname;

		if (pathname.includes("/search")) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					found: 2,
					totalNumPages: 1,
					pageNum: 1,
					results: [
						{
							SEARCHVAL: "1 FUSIONOPOLIS VIEW",
							BLK_NO: "1",
							ROAD_NAME: "FUSIONOPOLIS VIEW",
							BUILDING: "FUSIONOPOLIS",
							ADDRESS: "1 FUSIONOPOLIS VIEW ECLIPSE SINGAPORE 138577",
							POSTAL: "138577",
							X: "23627.8964",
							Y: "29932.7059",
							LATITUDE: "1.299941797074924",
							LONGITUDE: "103.78940434971592",
						},
					],
				}),
			});
		} else if (pathname.includes("/revgeocode")) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					GeocodeInfo: [
						{
							BUILDINGNAME: "FUSIONOPOLIS",
							BLOCK: "1",
							ROAD: "FUSIONOPOLIS VIEW",
							POSTALCODE: "138577",
							XCOORD: "23627.8964",
							YCOORD: "29932.7059",
							LATITUDE: "1.299941797074924",
							LONGITUDE: "103.78940434971592",
						},
					],
				}),
			});
		} else if (pathname.includes("/convertlatlngtoxy")) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					X: 23627.8964,
					Y: 29932.7059,
				}),
			});
		}
	});
};

export const mockOneMapAPIError = async (page: Page) => {
	await page.route("/api/onemap/**", async (route) => {
		await route.fulfill({
			status: 500,
			contentType: "application/json",
			body: JSON.stringify({
				error: "Internal Server Error",
				message: "OneMap service is temporarily unavailable",
			}),
		});
	});
};

export const mockGeolocation = async (
	page: Page,
	coords: { latitude: number; longitude: number } = {
		latitude: 1.299941797074924,
		longitude: 103.78940434971592,
	}
) => {
	await page.addInitScript(
		({ lat, lng }) => {
			navigator.geolocation.getCurrentPosition = (success) => {
				success({
					coords: {
						latitude: lat,
						longitude: lng,
						accuracy: 100,
						altitude: null,
						altitudeAccuracy: null,
						heading: null,
						speed: null,
					},
					timestamp: Date.now(),
				} as GeolocationPosition);
			};
		},
		{ lat: coords.latitude, lng: coords.longitude }
	);
};
