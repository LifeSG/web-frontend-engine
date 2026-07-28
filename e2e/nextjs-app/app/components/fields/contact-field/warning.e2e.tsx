"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "contact-field",
					label: "Contact Number",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
