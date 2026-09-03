"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "numeric-field",
					label: "Number",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
