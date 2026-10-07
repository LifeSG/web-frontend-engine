"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const LOCATION_FIELD_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "location-field",
					label: "Location With Custom Styles",
					// background is a disallowed declaration and should be stripped, padding/margin are layout and should apply
					locationModalStyles: "background: red;padding-top: 50px; margin-right: 10px;",
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
