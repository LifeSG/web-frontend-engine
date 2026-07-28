"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "email-field",
					label: "Email",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
