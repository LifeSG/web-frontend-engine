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
					locationModalStyles: "background: red;padding-top: 50px; margin-right: 10px;",
					mapApi: {
						reverseGeocode: "/api/onemap/revgeocode",
						convertLatLngToXY: "/api/onemap/4326to3414",
						search: "/api/onemap/search",
					},
				},
			},
		},
	},
	defaultValues: {
		field: {
			address: "1 FUSIONOPOLIS VIEW ECLIPSE SINGAPORE 138577",
			lat: 1.299941797074924,
			lng: 103.78940434971592,
		},
	},
};

export default function LocationFieldDefaultPage() {
	return <FrontendEngine data={LOCATION_FIELD_SCHEMA} />;
}
