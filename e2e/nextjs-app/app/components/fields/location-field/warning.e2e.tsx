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
				},
			},
		},
	},
};

export default createWarningPage({ schema: LOCATION_FIELD_WARNING_SCHEMA });
