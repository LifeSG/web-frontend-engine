"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const LOCATION_FIELD_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "location-field",
					label: "Location",
					mapApi: {
						reverseGeocode: "https://api.dev.life.gov.sg/onemap/revgeocode",
						convertLatLngToXY: "https://api.dev.life.gov.sg/onemap/4326to3414",
						search: "https://api.dev.life.gov.sg/onemap/search",
						headers: {
							"x-client-app": "LIFESG",
						},
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: LOCATION_FIELD_WARNING_SCHEMA });
