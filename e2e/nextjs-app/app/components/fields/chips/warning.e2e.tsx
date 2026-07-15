"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const CHIPS_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "chips",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
			},
		},
	},
};

export default createWarningPage({ schema: CHIPS_WARNING_SCHEMA });
