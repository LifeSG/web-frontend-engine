"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const DATE_FIELD_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "date-field",
					label: "Date",
				},
			},
		},
	},
};

export default createWarningPage({ schema: DATE_FIELD_WARNING_SCHEMA });
