"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SWITCH_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "switch",
					label: "Switch",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SWITCH_WARNING_SCHEMA });
