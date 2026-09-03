"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SLIDER_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "slider",
					label: "Number of fruits",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SLIDER_WARNING_SCHEMA });
