"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const LOCATION_FIELD_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "location-field",
					label: "Location",
					mapApi: {
						reverseGeocode: "/api/onemap/revgeocode",
						convertLatLngToXY: "/api/onemap/convertlatlngtoxy",
						search: "/api/onemap/search",
					},
				},
			},
		},
	},
};

export default function LocationFieldDefaultPage() {
	return <FrontendEngine data={LOCATION_FIELD_SCHEMA} />;
}
