"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const DATE_RANGE_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "date-range-field",
					label: "Date",
				},
			},
		},
	},
};

export default createWarningPage({ schema: DATE_RANGE_WARNING_SCHEMA });
