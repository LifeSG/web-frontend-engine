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
					legendItems: [
						{
							id: "Legend1",
							label: "Legend1",
							icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+",
						},
						{
							id: "Legend2",
							label: "Legend2",
							icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMDdCRkYiLz4KPC9zdmc+",
						},
					],
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

export default function LocationFieldLegendPage() {
	return <FrontendEngine data={LOCATION_FIELD_SCHEMA} />;
}
